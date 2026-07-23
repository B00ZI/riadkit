<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;
    protected $fillable = ['riad_id', 'category_id', 'name', 'description', 'price', 'is_available', 'requires_quantity'];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
        'requires_quantity' => 'boolean',
    ];

    public function riad(): BelongsTo
    {
        return $this->belongsTo(Riad::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}