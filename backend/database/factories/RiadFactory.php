<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RiadFactory extends Factory
{
    public function definition(): array
    {
        $name = 'Riad ' . fake()->city();
        return [
            'name' => $name,
            'subdomain' => Str::slug($name),
            'logoUrl' => fake()->imageUrl(200, 200, 'architecture'),
            'description' => fake()->paragraph(),
            'wifiName' => 'Riad_Guest_WiFi',
            'wifiPassword' => 'Marrakech2026',
            'whatsappNumber' => '+2126' . fake()->numerify('########'),
            'currency' => 'MAD',
            'instagramUrl' => 'https://instagram.com/' . Str::slug($name),
        ];
    }
}