<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\GuestSession;
use Illuminate\Http\Request;

class ReceptionController extends Controller
{
    public function checkout(Request $request, $roomId)
    {
        // 1. Get the room (ensure it belongs to the authenticated Riad)
        $room = $request->user()->riad->rooms()->findOrFail($roomId);

        // 2. The Kill Switch: Set ALL sessions for this room to 'inactive'
        GuestSession::where('room_id', $room->id)
                    ->update(['status' => 'inactive']);

        return response()->json([
            'message' => 'Room checked out successfully. Guest access terminated.'
        ]);
    }
    public function checkin(Request $request, $roomId)
{
    $room = $request->user()->riad->rooms()->findOrFail($roomId);

    // Create a NEW active session for this room
    GuestSession::create([
        'riad_id' => $room->riad_id,
        'room_id' => $room->id,
        'status' => 'active',
    ]);

    return response()->json(['message' => 'Room checked in successfully.']);
}
}