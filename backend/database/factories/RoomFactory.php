<?php
namespace Database\Factories;

use App\Models\Riad;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'riad_id' => Riad::factory(),
            'room_number' => 'Suite ' . fake()->numberBetween(101, 108),
            'type' => fake()->randomElement(['Deluxe Suite', 'Royal Suite', 'Standard Room', 'Junior Suite']),
            'qr_token' => Str::random(32),
            'status' => fake()->randomElement(['vacant', 'occupied']),
            'session_status' => 'expired',
        ];
    }
}