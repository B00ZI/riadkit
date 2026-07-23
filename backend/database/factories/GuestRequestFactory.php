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

        return [
            'riad_id' => Riad::factory(),
            'room_id' => Room::factory(),
            'session_id' => Str::random(20),
            'type' => $type,
            'item_id' => 1, // Will be overridden dynamically in DatabaseSeeder
            'quantity' => fake()->numberBetween(1, 4),
            'notes' => fake()->optional(40)->randomElement([
                'Please bring extra sugar with tea.',
                'Room needs to be cleaned before 2 PM.',
                'Packaged for takeaway please.',
            ]),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed', 'cancelled']),
            // Random dates across the last 12 months for chart historical revenue data
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
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            // Completed orders distributed across the whole past year
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }
}