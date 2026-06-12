<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\GuestSession;
use Illuminate\Http\Request;

class GuestSessionController extends Controller
{
   public function bootstrap(Request $request)
{
    $validated = $request->validate([
        'qr_token' => 'required|string',
        'session_id' => 'nullable|integer' // Accept the old session cookie
    ]);
    
    $room = Room::with('riad')->where('qr_token', $validated['qr_token'])->first();
    if (!$room) {
        return response()->json(['message' => 'Invalid QR Code'], 404);
    }

    // 1. �️ STICKY TOKEN DEFENSE: Check their specific cookie first
    if ($request->filled('session_id')) {
        $existingSession = GuestSession::where('id', $validated['session_id'])
                                       ->where('room_id', $room->id)
                                       ->first();

        // If their exact session is expired, they remain permanently blocked
        if ($existingSession && $existingSession->status === 'expired') {
            return response()->json([
                'session_id' => $existingSession->id,
                'session_status' => 'expired',
                'room_number' => $room->room_number,
                'riad' => $room->riad 
            ]);
        }
    }

    // 2. Otherwise, look for the current active session for this room
    $session = GuestSession::where('room_id', $room->id)
                           ->where('status', 'active')
                           ->latest()
                           ->first();

    if (!$session) {
        return response()->json([
            'session_id' => null,
            'session_status' => 'expired',
            'room_number' => $room->room_number,
            'riad' => $room->riad 
        ]);
    }

    return response()->json([
        'session_id' => $session->id,
        'session_status' => $session->status,
        'room_number' => $room->room_number,
        'riad' => $room->riad 
    ]);
}
}