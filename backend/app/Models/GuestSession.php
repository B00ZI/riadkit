<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class GuestSession extends Model
{
    use HasFactory; 

    protected $guarded = []; // Allow mass assignment

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function riad()
    {
        return $this->belongsTo(Riad::class);
    }
}