<?php

namespace App\Events;

use App\Models\GuestRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RequestCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public GuestRequest $guestRequest;

    public function __construct(GuestRequest $guestRequest)
    {
        // Only load room & riad since those are your exact relationships
        $this->guestRequest = $guestRequest->load(['room', 'riad']);
    }

    /**
     * Broadcast to the specific Riad's reception channel.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('riad.' . $this->guestRequest->riad_id . '.reception'),
        ];
    }

    /**
     * Broadcast event name.
     */
    public function broadcastAs(): string
    {
        return 'request.created';
    }

    /**
     * Payload matching YOUR exact database columns.
     */
    public function broadcastWith(): array
    {
        return [
            'id'          => $this->guestRequest->id,
            'riad_id'     => $this->guestRequest->riad_id,
            'room_id'     => $this->guestRequest->room_id,
            'room_name'   => $this->guestRequest->room->name ?? $this->guestRequest->room->number ?? 'Room #' . $this->guestRequest->room_id,
            'session_id'  => $this->guestRequest->session_id,
            'type'        => $this->guestRequest->type,        // 'menu', 'service', 'excursion'
            'item_id'     => $this->guestRequest->item_id,
            'quantity'    => $this->guestRequest->quantity,
            'notes'       => $this->guestRequest->notes,
            'status'      => $this->guestRequest->status,      // 'pending'
            'created_at'  => $this->guestRequest->created_at->toIso8601String(),
        ];
    }
}