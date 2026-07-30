<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'riad_id',
        'room_id',
        'session_id',
        'type',
        'item_id',
        'item_name',
        'unit_price',
        'quantity',
        'total_price',
        'notes',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'completed_at' => 'datetime',
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
