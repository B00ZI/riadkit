<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Riad extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'subdomain', 'logoUrl', 'logo_url', 'logo_public_id',
        'cover_image_url', 'cover_image_public_id', 'description',
        'wifiName', 'wifiPassword', 'whatsappNumber', 'currency',
        'instagramUrl',
    ];

    protected $casts = [
        'logoUrl' => 'string',
        'logo_url' => 'string',
        'logo_public_id' => 'string',
        'cover_image_url' => 'string',
        'cover_image_public_id' => 'string',
    ];

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

    public function guestRequests(): HasMany
    {
        return $this->hasMany(GuestRequest::class);
    }

    public function houseRules(): HasMany
    {
        return $this->hasMany(HouseRule::class)->orderBy('sort_order');
    }
}
