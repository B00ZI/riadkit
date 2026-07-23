<?php
namespace Database\Factories;

use App\Models\Category;
use App\Models\Riad;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenuItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'riad_id' => Riad::factory(),
            'category_id' => Category::factory(),
            'name' => fake()->randomElement(['Moroccan Mint Tea', 'Chicken Pastilla', 'Lamb Tagine', 'Berber Breakfast', 'Orange Blossom Salad']),
            'description' => fake()->sentence(),
            'price' => fake()->randomElement([25.00, 45.00, 120.00, 150.00]),
            'image_url' => fake()->imageUrl(400, 300, 'food'),
            'is_available' => true,
        ];
    }
}