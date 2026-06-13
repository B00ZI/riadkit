<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GuestRequest;
use App\Models\Room;
use Illuminate\Http\Request;

use App\Models\MenuItem;   
use App\Models\Service;   
use App\Models\Excursion; 

class GuestRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = $request->user()->riad->guestRequests()
            ->with(['room:id,room_number'])
            ->whereIn('status', ['pending', 'in_progress'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Map through to attach the actual item names
        $mappedRequests = $requests->map(function ($req) {
            $itemName = 'Unknown Item';

            if ($req->type === 'menu') {
                $item = MenuItem::find($req->item_id);
                $itemName = $item ? $item->name : 'Deleted Item';
            } elseif ($req->type === 'service') {
                $item = Service::find($req->item_id);
                $itemName = $item ? $item->name : 'Deleted Service';
            } elseif ($req->type === 'excursion') {
                $item = Excursion::find($req->item_id);
                $itemName = $item ? $item->name : 'Deleted Excursion';
            }

            return [
                'id' => $req->id,
                'room_number' => $req->room->room_number,
                'type' => $req->type,
                'item_name' => $itemName,
                'quantity' => $req->quantity,
                'notes' => $req->notes,
                'status' => $req->status,
                'created_at' => $req->created_at->diffForHumans(), // e.g., "5 mins ago"
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
            'notes' => $validated['notes'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Request received successfully',
            'request' => $guestRequest,
        ], 201);
    }
}
