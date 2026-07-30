<?php

namespace App\Http\Controllers;

use App\Events\NewNotification;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class RoomController extends Controller
{
    public function index(Request $request)
    {
        // Simple fetch - no relations needed anymore!
        $rooms = $request->user()->riad->rooms()
            ->orderBy('room_number')
            ->get();

        // Map the rooms to cleanly include an 'is_active' boolean using the new column
        $roomsWithStatus = $rooms->map(function ($room) {
            return [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'type' => $room->type,
                'qr_token' => $room->qr_token,
                'status' => $room->status, // vacant or occupied
                'is_active' => $room->session_status === 'active', // Derived directly from the enum
            ];
        });

        return response()->json([
            'rooms' => $roomsWithStatus,
        ]);
    }

    // Create a new room
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'type' => 'required|string|max:100', // e.g., Standard, Suite
        ]);

        // Automatically create the room linked to the owner's Riad
        $room = $request->user()->riad->rooms()->create([
            'room_number' => $validated['room_number'],
            'type' => $validated['type'],
            'qr_token' => Str::random(16), // Generate secure token
            'status' => 'vacant', // Default physical status
            'session_status' => 'expired', // Default guest session status
            'current_session_id' => null,
        ]);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'room_created',
            'title' => 'New Room Added',
            'description' => "Room {$validated['room_number']} has been added.",
            'data' => [
                'entity_type' => 'room',
                'entity_id' => $room->id,
                'room_number' => $validated['room_number'],
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Room added successfully',
            'room' => $room,
        ], 201);
    }

    // Update an existing room
    public function update(Request $request, $id)
    {
        // Find the room and ensure it belongs to this Riad
        $room = $request->user()->riad->rooms()->findOrFail($id);

        $validated = $request->validate([
            'room_number' => 'sometimes|required|string|max:50',
            'type' => 'sometimes|required|string|max:100',
        ]);

        $room->update($validated);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'room_updated',
            'title' => 'Room Updated',
            'description' => "Room {$room->room_number} has been updated.",
            'data' => [
                'entity_type' => 'room',
                'entity_id' => $room->id,
                'room_number' => $room->room_number,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Room updated successfully',
            'room' => [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'type' => $room->type,
                'qr_token' => $room->qr_token,
                'status' => $room->status,
                'is_active' => $room->session_status === 'active',
            ],
        ]);
    }

    // Delete a room
    public function destroy(Request $request, $id)
    {
        $room = $request->user()->riad->rooms()->findOrFail($id);
        $roomNumber = $room->room_number;
        $room->delete();

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'room_deleted',
            'title' => 'Room Removed',
            'description' => "Room {$roomNumber} has been removed.",
            'data' => [
                'entity_type' => 'room',
                'entity_id' => null,
                'room_number' => $roomNumber,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }

    private function portalUrl(string $qrToken): string
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        return rtrim($frontendUrl, '/') . "/room/{$qrToken}";
    }

    public function printData(Request $request, $id)
    {
        $room = $request->user()->riad->rooms()->findOrFail($id);

        return response()->json([
            'id' => $room->id,
            'room_number' => $room->room_number,
            'type' => $room->type,
            'qr_token' => $room->qr_token,
            'portal_url' => $this->portalUrl($room->qr_token),
            'riad_name' => $request->user()->riad->name ?? 'Riad',
        ]);
    }

    public function printBatch(Request $request)
    {
        $ids = $request->query('ids');
        if (!$ids) {
            return response()->json(['message' => 'No room IDs provided'], 400);
        }

        $idArray = collect(explode(',', $ids))->filter()->values();
        $riad = $request->user()->riad;
        $riadName = $riad->name ?? 'Riad';

        $rooms = $riad->rooms()->whereIn('id', $idArray)->orderBy('room_number')->get();

        return response()->json([
            'rooms' => $rooms->map(fn($r) => [
                'id' => $r->id,
                'room_number' => $r->room_number,
                'type' => $r->type,
                'qr_token' => $r->qr_token,
                'portal_url' => $this->portalUrl($r->qr_token),
                'riad_name' => $riadName,
            ]),
        ]);
    }

}
