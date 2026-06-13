<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Service;
use App\Models\Excursion;

class Riad extends Model
{
    protected $guarded = []; // Allow mass assignment for all fields

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function excursions(): HasMany
    {
        return $this->hasMany(Excursion::class);
    }
}
