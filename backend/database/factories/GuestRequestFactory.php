<?php
namespace Database\Factories;

use App\Models\Riad;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GuestRequestFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement(['menu', 'service', 'excursion']);

        $itemName = match ($type) {
            'menu' => fake()->randomElement(['Moroccan Mint Tea', 'Chicken Pastilla', 'Lamb Tagine', 'Berber Breakfast', 'Orange Blossom Salad']),
            'service' => fake()->randomElement(['Airport Shuttle', 'Hammam & Spa Package', 'Extra Towels & Linens', 'Laundry Service']),
            'excursion' => fake()->randomElement(['Ourika Valley Day Trip', 'Agafay Desert Quad & Dinner', 'Hot Air Balloon Ride']),
        };

        $unitPrice = match ($type) {
            'menu' => fake()->randomFloat(2, 25, 250),
            'service' => fake()->randomFloat(2, 0, 300),
            'excursion' => fake()->randomFloat(2, 350, 1500),
        };

        $quantity = fake()->numberBetween(1, 4);

        return [
            'riad_id' => Riad::factory(),
            'room_id' => Room::factory(),
            'session_id' => Str::random(20),
            'type' => $type,
            'item_id' => 1,
            'item_name' => $itemName,
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'total_price' => $unitPrice * $quantity,
            'notes' => fake()->optional(40)->randomElement([
                'Please bring extra sugar with tea.',
                'Room needs to be cleaned before 2 PM.',
                'Packaged for takeaway please.',
            ]),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed', 'cancelled']),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => fn (array $attrs) => $attrs['created_at'],
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'created_at' => now(),
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
            'created_at' => now(),
        ]);
    }

    public function completed(): static
    {
        $completedAt = fake()->dateTimeBetween('-1 year', 'now');

        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => $completedAt,
            'created_at' => $completedAt,
        ]);
    }
}
