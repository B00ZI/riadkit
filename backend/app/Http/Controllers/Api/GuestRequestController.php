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
        $requests = $request->user()->riad->guestRequests()
            ->with(['room:id,room_number'])
            ->orderBy('created_at', 'asc')
            ->get();

        $mappedRequests = $requests->map(function ($req) {
            $itemName = 'Unknown Item';
            $itemPrice = 0;

            if ($req->type === 'menu') {
                $item = MenuItem::find($req->item_id);
                if ($item) {
                    $itemName = $item->name;
                    $itemPrice = (float) $item->price;
                } else {
                    $itemName = 'Deleted Item';
                }
            } elseif ($req->type === 'service') {
                $item = Service::find($req->item_id);
                if ($item) {
                    $itemName = $item->name;
                    $itemPrice = (float) ($item->price ?? 0);
                } else {
                    $itemName = 'Deleted Service';
                }
            } elseif ($req->type === 'excursion') {
                $item = Excursion::find($req->item_id);
                if ($item) {
                    $itemName = $item->name;
                    $itemPrice = (float) $item->price;
                } else {
                    $itemName = 'Deleted Excursion';
                }
            }

            $totalPrice = $itemPrice * (int) $req->quantity;

            return [
                'id' => $req->id,
                'room_number' => $req->room->room_number,
                'type' => $req->type,
                'item_name' => $itemName,
                'quantity' => $req->quantity,
                'total_price' => number_format($totalPrice, 2, '.', ''), // e.g., "150.00"
                'notes' => $req->notes,
                'status' => $req->status,
                'created_at' => $req->created_at->diffForHumans(),
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
