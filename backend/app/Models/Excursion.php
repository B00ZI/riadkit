<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Excursion extends Model
{
    use HasFactory;
    protected $fillable = [
        'riad_id',
        'name',
        'description',
        'price',
        'duration',
        'image_url',
        'image_public_id',
        'is_available'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    public function riad(): BelongsTo
    {
        return $this->belongsTo(Riad::class);
    }
}