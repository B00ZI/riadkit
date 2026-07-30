<?php

namespace App\Http\Controllers\Api;

use App\Events\NewNotification;
use App\Http\Controllers\Controller;
use App\Models\Excursion;
use App\Models\GuestRequest;
use App\Models\MenuItem;
use App\Models\Notification;
use App\Models\Room;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Events\RequestCreated;
use App\Events\RequestUpdated;

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

        // ─── 5. MAP TO FRONTEND FORMAT ────────────────────────
        $mappedRequests = $requests->map(function ($req) {
            $itemName = $req->item_name ?? 'Deleted Item';
            $totalPrice = (float) ($req->total_price ?? 0);

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

    public function update(Request $request, GuestRequest $guestRequest)
    {
        if ($guestRequest->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $oldStatus = $guestRequest->status;

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $updateData = ['status' => $validated['status']];
        if ($validated['status'] === 'completed') {
            $updateData['completed_at'] = now();
        }
        $guestRequest->update($updateData);

        // ⚡ BROADCAST: Notify WebSocket listeners of request status update
        RequestUpdated::dispatch($guestRequest, $oldStatus);

        $itemName = $guestRequest->item_name ?? 'Request';
        $itemTypeLabel = match ($guestRequest->type) {
            'menu' => 'Food',
            'service' => 'Service',
            'excursion' => 'Excursion',
            default => 'Order',
        };

        [$notifType, $notifTitle] = match ($validated['status']) {
            'in_progress' => ['order_in_progress', "{$itemTypeLabel} In Progress"],
            'completed' => ['order_completed', "{$itemTypeLabel} Completed"],
            'cancelled' => ['order_cancelled', "{$itemTypeLabel} Cancelled"],
            default => [null, null],
        };

        if ($notifType) {
            $notification = Notification::create([
                'riad_id' => $guestRequest->riad_id,
                'type' => $notifType,
                'title' => $notifTitle,
                'description' => "Room {$guestRequest->room->room_number} — {$itemName}",
                'data' => [
                    'entity_type' => 'guest_request',
                    'entity_id' => $guestRequest->id,
                    'room_number' => $guestRequest->room->room_number,
                    'item_name' => $itemName,
                    'status' => $validated['status'],
                ],
            ]);
            NewNotification::dispatch($notification);
        }

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

        // 2. STICKY TOKEN DEFENSE
        if ($room->session_status !== 'active' || $room->current_session_id !== $validated['session_id']) {
            return response()->json([
                'message' => 'Session expired. Please scan the current room QR code to place requests.',
            ], 403);
        }

        // 3. Look up the item to snapshot price and name
        $item = match ($validated['type']) {
            'menu' => MenuItem::find($validated['item_id']),
            'service' => Service::find($validated['item_id']),
            'excursion' => Excursion::find($validated['item_id']),
            default => null,
        };

        if (! $item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $quantity = $validated['quantity'] ?? 1;
        $unitPrice = (float) ($item->price ?? 0);
        $totalPrice = $unitPrice * $quantity;

        // 4. Create the Request with price snapshot
        $guestRequest = GuestRequest::create([
            'riad_id' => $room->riad_id,
            'room_id' => $room->id,
            'session_id' => $room->current_session_id,
            'type' => $validated['type'],
            'item_id' => $validated['item_id'],
            'item_name' => $item->name,
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'total_price' => $totalPrice,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        // Load relation for response and broadcast
        $guestRequest->load('room:id,room_number');

        // ⚡ BROADCAST: Dispatch new request event to Reverb
        RequestCreated::dispatch($guestRequest);

        // Notification
        $itemName = $guestRequest->item_name ?? 'Request';

        [$notifType, $notifTitle] = match ($guestRequest->type) {
            'menu' => ['new_menu_order', 'New Food Order'],
            'service' => ['new_service_order', 'New Service Request'],
            'excursion' => ['new_excursion_order', 'New Excursion Booking'],
            default => ['new_order', 'New Request'],
        };

        $notification = Notification::create([
            'riad_id' => $room->riad_id,
            'type' => $notifType,
            'title' => $notifTitle,
            'description' => "Room {$room->room_number} requested {$quantity}× {$itemName}.",
            'data' => [
                'entity_type' => 'guest_request',
                'entity_id' => $guestRequest->id,
                'room_number' => $room->room_number,
                'item_name' => $itemName,
                'quantity' => $quantity,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Request received successfully',
            'request' => $guestRequest,
        ], 201);
    }
}
