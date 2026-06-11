<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\GuestSession;
use Illuminate\Http\Request;

class ReceptionController extends Controller
{
    public function checkout(Request $request, $roomId)
    {
        $room = $request->user()->riad->rooms()->findOrFail($roomId);

        // Terminology Alignment: We mark all sessions for this room as 'expired'
        GuestSession::where('room_id', $room->id)
                    ->update(['status' => 'expired']);

        return response()->json([
            'message' => 'Room checked out successfully. Guest access terminated.'
        ]);
    }

    public function checkin(Request $request, $roomId)
    {
        $room = $request->user()->riad->rooms()->findOrFail($roomId);

        // Ensure there are no lingering active sessions before creating a new one
        GuestSession::where('room_id', $room->id)->update(['status' => 'expired']);

        // Create a NEW active session
        GuestSession::create([
            'riad_id' => $room->riad_id,
            'room_id' => $room->id,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Room checked in successfully.'
        ]);
    }
}