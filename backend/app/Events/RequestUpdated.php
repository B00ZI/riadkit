<?php

namespace App\Events;

use App\Models\GuestRequest;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RequestUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public GuestRequest $guestRequest;
    public ?string $oldStatus;

    public function __construct(GuestRequest $guestRequest, ?string $oldStatus = null)
    {
        $this->guestRequest = $guestRequest->load(['room', 'riad']);
        $this->oldStatus = $oldStatus;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('riad.' . $this->guestRequest->riad_id . '.reception'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'request.updated';
    }

    public function broadcastWith(): array
    {
        $itemName = $this->guestRequest->item_name ?? 'Deleted Item';
        $totalPrice = (float) ($this->guestRequest->total_price ?? 0);

        return [
            'id'           => $this->guestRequest->id,
            'riad_id'      => $this->guestRequest->riad_id,
            'room_id'      => $this->guestRequest->room_id,
            'room_name'    => $this->guestRequest->room->room_number ?? 'Room #' . $this->guestRequest->room_id,
            'item_name'    => $itemName,
            'session_id'   => $this->guestRequest->session_id,
            'type'         => $this->guestRequest->type,
            'item_id'      => $this->guestRequest->item_id,
            'quantity'     => $this->guestRequest->quantity,
            'total_price'  => $totalPrice,
            'notes'        => $this->guestRequest->notes,
            'status'       => $this->guestRequest->status,
            'old_status'   => $this->oldStatus,
            'created_at'   => $this->guestRequest->created_at->toIso8601String(),
        ];
    }
}
