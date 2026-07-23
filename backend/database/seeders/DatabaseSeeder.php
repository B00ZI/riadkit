<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Excursion;
use App\Models\GuestRequest;
use App\Models\MenuItem;
use App\Models\Riad;
use App\Models\Room;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Demo Riad
        $demoRiad = Riad::factory()->create([
            'name' => 'Riad Jardin de Marrakech',
            'subdomain' => 'jardin',
            'whatsappNumber' => '+212600000000',
            'currency' => 'MAD',
        ]);

        // 2. Owner Account
        User::factory()->create([
            'riad_id' => $demoRiad->id,
            'name' => 'Riad Owner',
            'email' => 'owner@riadkit.test',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);

        // 3. Rooms
        $rooms = Room::factory()->count(6)->create([
            'riad_id' => $demoRiad->id,
        ]);

        // 4. Menu Items
        $menuCategories = ['Breakfast & Drinks', 'Traditional Dishes', 'Desserts'];
        foreach ($menuCategories as $catName) {
            $cat = Category::factory()->create([
                'riad_id' => $demoRiad->id,
                'name' => $catName,
                'type' => 'menu',
            ]);

            MenuItem::factory()->count(10)->create([
                'riad_id' => $demoRiad->id,
                'category_id' => $cat->id,
            ]);
        }

        // 5. Services
        $serviceCategories = ['Wellness & Spa', 'Housekeeping & Amenities', 'Transport'];
        foreach ($serviceCategories as $catName) {
            $cat = Category::factory()->create([
                'riad_id' => $demoRiad->id,
                'name' => $catName,
                'type' => 'service',
            ]);

            Service::factory()->count(5)->create([
                'riad_id' => $demoRiad->id,
                'category_id' => $cat->id,
            ]);
        }

        // 6. Excursions
        Excursion::factory()->count(8)->create([
            'riad_id' => $demoRiad->id,
        ]);

        // Fetch array of real, existing IDs
        $menuItemIds = MenuItem::where('riad_id', $demoRiad->id)->pluck('id')->toArray();
        $serviceIds  = Service::where('riad_id', $demoRiad->id)->pluck('id')->toArray();
        $excursionIds = Excursion::where('riad_id', $demoRiad->id)->pluck('id')->toArray();

        // Helper function to pick a valid ID based on type
        $getValidItemId = function (string $type) use ($menuItemIds, $serviceIds, $excursionIds) {
            return match ($type) {
                'menu' => fake()->randomElement($menuItemIds),
                'service'   => fake()->randomElement($serviceIds),
                'excursion' => fake()->randomElement($excursionIds),
                default     => fake()->randomElement($menuItemIds),
            };
        };

        // 7. Seed active requests for live view (Today)
        foreach ($rooms as $room) {
            GuestRequest::factory()->pending()->create([
                'riad_id' => $demoRiad->id,
                'room_id' => $room->id,
                'type' => 'service',
                'item_id' => fake()->randomElement($serviceIds),
            ]);

            GuestRequest::factory()->inProgress()->create([
                'riad_id' => $demoRiad->id,
                'room_id' => $room->id,
                'type' => 'menu',
                'item_id' => fake()->randomElement($menuItemIds),
            ]);
        }

        // 8. Seed 150 historical completed requests spread across the entire year for charts
        for ($i = 0; $i < 150; $i++) {
            $type = fake()->randomElement(['menu', 'service', 'excursion']);

            GuestRequest::factory()->completed()->create([
                'riad_id' => $demoRiad->id,
                'room_id' => $rooms->random()->id,
                'type' => $type,
                'item_id' => $getValidItemId($type),
            ]);
        }
    }
}