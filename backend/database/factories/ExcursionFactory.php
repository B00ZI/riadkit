<?php

namespace Database\Factories;

use App\Models\Riad;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExcursionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'riad_id' => Riad::factory(),
            'name' => fake()->randomElement(['Ourika Valley Day Trip', 'Agafay Desert Quad & Dinner', 'Ouarzazate & Ait Ben Haddou', 'Hot Air Balloon Ride']),
            'description' => fake()->paragraph(),
            'price' => fake()->randomElement([350.00, 600.00, 1200.00]),
            'duration' => fake()->randomElement(['Half Day', 'Full Day', '3 Hours']),
            'image_url' => fake()->imageUrl(600, 400, 'travel'),
            'is_available' => true,
        ];
    }
}