<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $guarded = []; // Allow mass assignment

    public function riad()
    {
        return $this->belongsTo(Riad::class);
    }

    public function sessions()
    {
        return $this->hasMany(GuestSession::class);
    }

    public function guestRequests(): HasMany
    {
        return $this->hasMany(GuestRequest::class);
    }
}
