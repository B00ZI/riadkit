<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    // Get all rooms for the logged-in owner's Riad
    public function index(Request $request)
    {
        $rooms = $request->user()->riad->rooms()->orderBy('room_number')->get();
        
        return response()->json([
            'rooms' => $rooms
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
            'status' => 'available'
        ]);

        return response()->json([
            'message' => 'Room added successfully',
            'room' => $room
        ], 201);
    }

    // Delete a room
    public function destroy(Request $request, $id)
    {
        // Find the room, making sure it belongs to THIS riad!
        $room = $request->user()->riad->rooms()->findOrFail($id);
        
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully'
        ]);
    }
}