<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    // List all rooms for owners and receptionists including their active session status
    public function index(Request $request)
    {
        // Fetch rooms and load only their LATEST active session (if any)
        $rooms = $request->user()->riad->rooms()
            ->with(['sessions' => function ($query) {
                $query->where('status', 'active');
            }])
            ->orderBy('room_number')
            ->get();

        // Map the rooms to cleanly include an 'is_active' boolean
        $roomsWithStatus = $rooms->map(function ($room) {
            return [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'type' => $room->type,
                'qr_token' => $room->qr_token,
                'is_active' => $room->sessions->isNotEmpty(), // True if there is an active session
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
            'qr_token' => Str::random(16), // Generate a random 16-character string for the QR!
            'status' => 'available',
        ]);

        return response()->json([
            'message' => 'Room added successfully',
            'room' => $room,
        ], 201);
    }

    // Delete a room
    public function destroy(Request $request, $id)
    {
        // Find the room, making sure it belongs to THIS riad!
        $room = $request->user()->riad->rooms()->findOrFail($id);

        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }
}
