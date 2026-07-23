<?php

namespace Database\Factories;

use App\Models\Riad;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'riad_id' => Riad::factory(),
            'name' => fake()->word(),
            'type' => 'menu',
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}