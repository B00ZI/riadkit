<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Excursion;
use App\Models\GuestRequest;
use App\Models\MenuItem;
use App\Models\Room;
use App\Models\Service;
use Illuminate\Http\Request;

class GuestRequestController extends Controller
{
  public function index(Request $request)
{
    $query = $request->user()->riad->guestRequests()
        ->with(['room:id,room_number']);

    // ─── 1. STATUS FILTER ──────────────────────────────────
    if ($request->has('status') && $request->status !== 'all') {
        $statuses = explode(',', $request->status);
        $query->whereIn('status', $statuses);
    }

    // ─── 2. DAYS FILTER (only for completed) ──────────────
    if ($request->has('days') && is_numeric($request->days)) {
        $days = (int) $request->days;
        $query->where(function ($q) use ($days) {
            $q->where('status', '!=', 'completed')
                ->orWhereDate('created_at', '>=', now()->subDays($days));
        });
    }

    // ─── 3. DATE RANGE FILTERS ────────────────────────────
    if ($request->has('from')) {
        $query->whereDate('created_at', '>=', $request->from);
    }
    if ($request->has('to')) {
        $query->whereDate('created_at', '<=', $request->to);
    }

    // ─── 4. SORTING ────────────────────────────────────────
    $sort = $request->get('sort', 'desc');
    $query->orderBy('created_at', $sort === 'asc' ? 'asc' : 'desc');

    $requests = $query->get();

    // ─── 5. BULK LOAD ITEM DATA (ELIMINATES N+1) ──────────
    $menuIds = [];
    $serviceIds = [];
    $excursionIds = [];

    foreach ($requests as $req) {
        if ($req->type === 'menu') {
            $menuIds[] = $req->item_id;
        } elseif ($req->type === 'service') {
            $serviceIds[] = $req->item_id;
        } elseif ($req->type === 'excursion') {
            $excursionIds[] = $req->item_id;
        }
    }

    $menuItems   = MenuItem::whereIn('id', $menuIds)->get()->keyBy('id');
    $services    = Service::whereIn('id', $serviceIds)->get()->keyBy('id');
    $excursions  = Excursion::whereIn('id', $excursionIds)->get()->keyBy('id');

    // ─── 6. MAP TO FRONTEND FORMAT ────────────────────────
    $mappedRequests = $requests->map(function ($req) use ($menuItems, $services, $excursions) {
        $item = null;

        if ($req->type === 'menu') {
            $item = $menuItems->get($req->item_id);
        } elseif ($req->type === 'service') {
            $item = $services->get($req->item_id);
        } elseif ($req->type === 'excursion') {
            $item = $excursions->get($req->item_id);
        }

        $itemName = $item?->name ?? 'Deleted Item';
        $itemPrice = (float) ($item?->price ?? 0);
        $totalPrice = $itemPrice * (int) $req->quantity;

        return [
            'id'             => $req->id,
            'room_number'    => $req->room->room_number,
            'type'           => $req->type,
            'item_name'      => $itemName,
            'quantity'       => $req->quantity,
            'total_price'    => number_format($totalPrice, 2, '.', ''),
            'notes'          => $req->notes,
            'status'         => $req->status,
            'created_at'     => $req->created_at->diffForHumans(),
            'created_at_raw' => $req->created_at->toISOString(),
        ];
    });

    return response()->json($mappedRequests);
}

    public function update(Request $request, $id)
    {
        $guestRequest = $request->user()->riad->guestRequests()->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $guestRequest->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Status updated']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'qr_token' => 'required|string',
            'session_id' => 'required|string',
            'type' => 'required|in:menu,service,excursion',
            'item_id' => 'required|integer',
            'quantity' => 'nullable|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        // 1. Find the Room securely using the QR Token
        $room = Room::where('qr_token', $validated['qr_token'])->first();

        if (! $room) {
            return response()->json(['message' => 'Invalid QR Token'], 404);
        }

        // 2. �️ STICKY TOKEN DEFENSE
        // Check if the guest's session matches the room's active session
        if ($room->session_status !== 'active' || $room->current_session_id !== $validated['session_id']) {
            return response()->json([
                'message' => 'Session expired. Please scan the current room QR code to place requests.',
            ], 403);
        }

        // 3. Create the Request
        $guestRequest = GuestRequest::create([
            'riad_id' => $room->riad_id,
            'room_id' => $room->id,
            'session_id' => $room->current_session_id,
            'type' => $validated['type'],
            'item_id' => $validated['item_id'],
            'quantity' => $validated['quantity'] ?? 1,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Request received successfully',
            'request' => $guestRequest,
        ], 201);
    }
}
