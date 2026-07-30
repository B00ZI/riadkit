<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'riad_id', 'room_number', 'type', 'qr_token', 'status',
        'session_status', 'current_session_id', 'checked_in_at',
    ];

    public function riad()
    {
        return $this->belongsTo(Riad::class);
    }

    public function guestRequests(): HasMany
    {
        return $this->hasMany(GuestRequest::class);
    }
}
