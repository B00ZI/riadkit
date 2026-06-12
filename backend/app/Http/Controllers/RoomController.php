<?php

namespace App\Http\Controllers;

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
                'status' => $room->status, // Vacant or Occupied
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
            'status' => 'Vacant', // Default physical status
            'session_status' => 'expired', // Default guest session status
            'current_session_id' => null,
        ]);

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
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }
}
