<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestRequest extends Model
{
    protected $fillable = [
        'riad_id',
        'room_id',
        'session_id',
        'type',
        'item_id',
        'quantity',
        'notes',
        'status',
    ];

    public function riad(): BelongsTo
    {
        return $this->belongsTo(Riad::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}