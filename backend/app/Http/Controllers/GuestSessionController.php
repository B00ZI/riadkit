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
    
    $room = Room::with('riad')->where('qr_token', $validated['qr_token'])->first();
    if (!$room) return response()->json(['message' => 'Invalid QR'], 404);

    // 1. Look for the most recent ACTIVE session for this room
    $session = GuestSession::where('room_id', $room->id)
                           ->where('status', 'active')
                           ->latest()
                           ->first();

    // 2. If no active session, create a fresh one (New Guest Arrival)
    if (!$session) {
        $session = GuestSession::create([
            'riad_id' => $room->riad_id,
            'room_id' => $room->id,
            'status' => 'active',
        ]);
    }

    return response()->json([
        'session_id' => $session->id,
        'session_status' => $session->status,
        'room_number' => $room->room_number,
        'riad' => $room->riad // Returning the whole object for simplicity
    ]);
}
}