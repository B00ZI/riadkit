<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\GuestSession;
use Illuminate\Http\Request;

class GuestSessionController extends Controller
{
    public function bootstrap(Request $request)
    {
        $validated = $request->validate(['qr_token' => 'required|string']);
        
        // 1. Find the Room
        $room = Room::with('riad')->where('qr_token', $validated['qr_token'])->first();
        if (!$room) {
            return response()->json(['message' => 'Invalid QR Code'], 404);
        }

        // 2. Look for the most recent ACTIVE session for this room
        $session = GuestSession::where('room_id', $room->id)
                               ->where('status', 'active')
                               ->latest()
                               ->first();

        // 3. SECURE BLOCK: If no active session exists, the room is vacant!
        // We do NOT create a session automatically. We return 'expired'.
        if (!$session) {
            return response()->json([
                'session_id' => null,
                'session_status' => 'expired', // Tells frontend to show expired UI
                'room_number' => $room->room_number,
                'riad' => $room->riad 
            ]);
        }

        // 4. If an active session exists (created by receptionist), return it
        return response()->json([
            'session_id' => $session->id,
            'session_status' => $session->status, // 'active'
            'room_number' => $room->room_number,
            'riad' => $room->riad 
        ]);
    }
}