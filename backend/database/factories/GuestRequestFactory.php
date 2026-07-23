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
        $types = ['menu_item', 'service', 'excursion', 'custom'];
        $type = fake()->randomElement($types);

        return [
            'riad_id' => Riad::factory(),
            'room_id' => Room::factory(),
            'session_id' => Str::random(20),
            'type' => $type,
            'item_id' => fake()->numberBetween(1, 20),
            'quantity' => fake()->numberBetween(1, 4),
            'notes' => fake()->optional(60)->randomElement([
                'Please bring extra sugar with tea.',
                'Need this as soon as possible.',
                'Packaged for takeaway please.',
                'Room needs to be cleaned before 2 PM.',
            ]),
            // Spread statuses to simulate a real live dashboard
            'status' => fake()->randomElement(['pending', 'pending', 'in_progress', 'completed', 'cancelled']),
        ];
    }

    /**
     * Helper states to force specific statuses when seeding testing data
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending']);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'in_progress']);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'completed']);
    }
}