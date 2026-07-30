<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HouseRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'riad_id', 'title', 'description', 'value',
        'icon', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function riad(): BelongsTo
    {
        return $this->belongsTo(Riad::class);
    }
}
