<?php
namespace Database\Factories;

use App\Models\Category;
use App\Models\Riad;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'riad_id' => Riad::factory(),
            'category_id' => Category::factory(),
            'name' => fake()->randomElement([
                'Airport Shuttle',
                'Hammam & Spa Package',
                'Extra Towels & Linens',
                'Luggage Storage',
                'Laundry Service',
                'Late Check-out Request',
            ]),
            'description' => fake()->sentence(),
            'price' => fake()->randomElement([0.00, 50.00, 150.00, 300.00]),
            'is_available' => true,
            'requires_quantity' => fake()->boolean(30),
        ];
    }
}