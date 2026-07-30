<?php

namespace App\Events;

use App\Models\Room;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RoomStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Room $room;

    public function __construct(Room $room)
    {
        $this->room = $room;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('riad.' . $this->room->riad_id . '.reception'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'room.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id'               => $this->room->id,
            'riad_id'          => $this->room->riad_id,
            'room_number'      => $this->room->room_number,
            'status'           => $this->room->status,
            'session_status'   => $this->room->session_status,
            'current_session_id' => $this->room->current_session_id,
        ];
    }
}
