<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
    protected $fillable = ['riad_id', 'name', 'type', 'sort_order'];

    public function riad(): BelongsTo
    {
        return $this->belongsTo(Riad::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('name');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class)->orderBy('name');
    }
}