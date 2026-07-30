<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ItemAvailabilityChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $itemType;
    public int $itemId;
    public string $itemName;
    public bool $isAvailable;
    public int $riadId;

    public function __construct(string $itemType, int $itemId, string $itemName, bool $isAvailable, int $riadId)
    {
        $this->itemType = $itemType;
        $this->itemId = $itemId;
        $this->itemName = $itemName;
        $this->isAvailable = $isAvailable;
        $this->riadId = $riadId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('riad.' . $this->riadId . '.reception'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'item.availability.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'item_type' => $this->itemType,
            'item_id' => $this->itemId,
            'item_name' => $this->itemName,
            'is_available' => $this->isAvailable,
        ];
    }
}
