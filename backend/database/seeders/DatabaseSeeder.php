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
        // 1. Primary Demo Riad
        $demoRiad = Riad::factory()->create([
            'name' => 'Riad Jardin de Marrakech',
            'subdomain' => 'jardin',
            'whatsappNumber' => '+212600000000',
            'currency' => 'MAD',
        ]);

        // 2. Demo Riad Owner
        User::factory()->create([
            'riad_id' => $demoRiad->id,
            'name' => 'Riad Owner',
            'email' => 'owner@riadkit.test',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);

        // 3. Create Rooms
        $rooms = Room::factory()->count(6)->create([
            'riad_id' => $demoRiad->id,
        ]);

        // 4. Create Menu Categories & Items
        $menuCategories = ['Breakfast & Drinks', 'Traditional Dishes', 'Desserts'];
        foreach ($menuCategories as $catName) {
            $cat = Category::factory()->create([
                'riad_id' => $demoRiad->id,
                'name' => $catName,
                'type' => 'menu',
            ]);

            MenuItem::factory()->count(4)->create([
                'riad_id' => $demoRiad->id,
                'category_id' => $cat->id,
            ]);
        }

        // 5. Create Service Categories & Services
        $serviceCategories = ['Wellness & Spa', 'Housekeeping & Amenities', 'Transport'];
        foreach ($serviceCategories as $catName) {
            $cat = Category::factory()->create([
                'riad_id' => $demoRiad->id,
                'name' => $catName,
                'type' => 'service',
            ]);

            Service::factory()->count(3)->create([
                'riad_id' => $demoRiad->id,
                'category_id' => $cat->id,
            ]);
        }

        // 6. Excursions
        Excursion::factory()->count(4)->create([
            'riad_id' => $demoRiad->id,
        ]);

        // 7. Generate Guest Requests across different states for each Room
        foreach ($rooms as $room) {
            // Guarantee at least 1 pending, 1 in_progress, and 1 completed request per room
            GuestRequest::factory()->pending()->create([
                'riad_id' => $demoRiad->id,
                'room_id' => $room->id,
                'type' => 'service',
            ]);

            GuestRequest::factory()->inProgress()->create([
                'riad_id' => $demoRiad->id,
                'room_id' => $room->id,
                'type' => 'menu_item',
            ]);

            GuestRequest::factory()->completed()->create([
                'riad_id' => $demoRiad->id,
                'room_id' => $room->id,
                'type' => 'excursion',
            ]);
        }
    }
}