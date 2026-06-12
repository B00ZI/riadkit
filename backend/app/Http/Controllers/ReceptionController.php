<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReceptionController extends Controller
{
    public function checkIn(Request $request, Room $room)
    {
        // Ensure the room belongs to the user's Riad
        if ($room->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $room->update([
            'status' => 'Occupied',
            'current_session_id' => Str::random(16), 
            'session_status' => 'active',
        ]);

        // Refresh comes AFTER update to fix stale data
        $room->refresh();

        return response()->json([
            'message' => 'Checked in successfully',
            'room' => $room,
        ]);
    }

    public function checkOut(Request $request, Room $room)
    {
        // Ensure the room belongs to the user's Riad
        if ($room->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $room->update([
            'status' => 'Vacant',
            'session_status' => 'expired', 
        ]);

        // Refresh comes AFTER update to fix stale data
        $room->refresh();

        return response()->json([
            'message' => 'Checked out successfully',
            'room' => $room,
        ]);
    }
}
