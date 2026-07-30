<?php

namespace App\Http\Controllers;

use App\Events\NewNotification;
use App\Events\RoomStatusUpdated;
use App\Models\Notification;
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
            'status' => 'occupied',
            'current_session_id' => Str::random(16),
            'session_status' => 'active',
            'checked_in_at' => now(),
        ]);

        // Refresh comes AFTER update to fix stale data
        $room->refresh();

        // ⚡ BROADCAST: Notify WebSocket listeners of room status change
        RoomStatusUpdated::dispatch($room);

        // Notification
        $notification = Notification::create([
            'riad_id' => $room->riad_id,
            'type' => 'guest_checked_in',
            'title' => 'Guest Checked In',
            'description' => "Room {$room->room_number} — guest checked in.",
            'data' => [
                'entity_type' => 'room',
                'entity_id' => $room->id,
                'room_number' => $room->room_number,
            ],
        ]);
        NewNotification::dispatch($notification);

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
            'status' => 'vacant',
            'session_status' => 'expired', 
        ]);

        // Refresh comes AFTER update to fix stale data
        $room->refresh();

        // ⚡ BROADCAST: Notify WebSocket listeners of room status change
        RoomStatusUpdated::dispatch($room);

        // Notification
        $notification = Notification::create([
            'riad_id' => $room->riad_id,
            'type' => 'guest_checked_out',
            'title' => 'Guest Checked Out',
            'description' => "Room {$room->room_number} — guest checked out.",
            'data' => [
                'entity_type' => 'room',
                'entity_id' => $room->id,
                'room_number' => $room->room_number,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Checked out successfully',
            'room' => $room,
        ]);
    }
}
