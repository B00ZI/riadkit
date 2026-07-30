<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Excursion;
use App\Models\GuestRequest;
use App\Models\MenuItem;
use App\Models\Notification;
use App\Models\Riad;
use App\Models\Room;
use App\Models\Service;
use App\Models\HouseRule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    private array $imagePool = [
        'breakfast' => [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
        ],
        'tagine' => [
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
        ],
        'couscous' => [
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
        ],
        'tea' => [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
        ],
        'pastries' => [
            'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
        ],
        'juice' => [
            'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80',
        ],
        'food' => [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
            'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
            'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80',
        ],
        'spa' => [
            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
        ],
        'laundry' => [
            'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80',
        ],
        'transport' => [
            'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
        ],
        'camel' => [
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',
        ],
        'mountains' => [
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
        ],
        'desert' => [
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
        ],
        'valley' => [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
        ],
        'medina' => [
            'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80',
        ],
        'balloon' => [
            'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&q=80',
        ],
        'waterfall' => [
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80',
        ],
        'riad' => [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        ],
    ];

    private array $notesPool = [
        'No onions please.',
        'Extra spicy if possible.',
        'Vegetarian option please.',
        'Please deliver after 7 PM.',
        'Two towels please.',
        'Nut allergy — please check ingredients.',
        'Gluten-free option if available.',
        'Please bring to the rooftop.',
        'Leave outside the door, thank you.',
        'Can we have this at 8 AM?',
        'Extra mint please.',
        'Well done please.',
        'As a takeaway please.',
        'No salt.',
    ];

    private function img(string $category): string
    {
        $pool = $this->imagePool[$category] ?? $this->imagePool['riad'];
        return $pool[array_rand($pool)];
    }

    public function run(): void
    {
        // ─── 1. RIAD ────────────────────────────────────────────
        $riad = Riad::create([
            'name' => 'Riad El Fenn',
            'subdomain' => 'el-fenn',
            'logoUrl' => null,
            'logo_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80',
            'cover_image_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
            'description' => 'A serene hideaway in the heart of the Marrakech Medina. Riad El Fenn blends traditional Moroccan craftsmanship with modern luxury. Jasmine-covered courtyards, a rooftop terrace overlooking the Atlas Mountains, and an authentic hammam await every guest.',
            'wifiName' => 'RiadElFenn',
            'wifiPassword' => 'Fenn2024!',
            'whatsappNumber' => '+212661234567',
            'currency' => 'MAD',
            'instagramUrl' => 'https://instagram.com/riadelfenn',
        ]);

        // ─── 2. STAFF ───────────────────────────────────────────
        User::create([
            'riad_id' => $riad->id,
            'name' => 'Youssef Benali',
            'email' => 'youssef@riadelfenn.test',
            'phone' => '+212661234568',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);
        User::create([
            'riad_id' => $riad->id,
            'name' => 'Fatima Zahra El Amrani',
            'email' => 'fatima@riadelfenn.test',
            'phone' => '+212661234569',
            'password' => Hash::make('password'),
            'role' => 'receptionist',
        ]);
        User::create([
            'riad_id' => $riad->id,
            'name' => 'Karim Ouazzani',
            'email' => 'karim@riadelfenn.test',
            'phone' => '+212661234570',
            'password' => Hash::make('password'),
            'role' => 'receptionist',
        ]);
        User::create([
            'riad_id' => $riad->id,
            'name' => 'Leila Bensouda',
            'email' => 'leila@riadelfenn.test',
            'phone' => '+212661234571',
            'password' => Hash::make('password'),
            'role' => 'receptionist',
        ]);

        // ─── 3. ROOMS ───────────────────────────────────────────
        $roomDefs = [
            ['name' => 'Atlas',     'type' => 'Junior Suite', 'occupied' => true],
            ['name' => 'Majorelle', 'type' => 'Suite',        'occupied' => true],
            ['name' => 'Sahara',    'type' => 'Deluxe',       'occupied' => true],
            ['name' => 'Jasmine',   'type' => 'Standard',     'occupied' => true],
            ['name' => 'Koutoubia', 'type' => 'Suite',        'occupied' => false],
            ['name' => 'Bahia',     'type' => 'Standard',     'occupied' => false],
            ['name' => 'Palm',      'type' => 'Deluxe',       'occupied' => false],
            ['name' => 'Oasis',     'type' => 'Junior Suite', 'occupied' => false],
            ['name' => 'Médina',    'type' => 'Standard',     'occupied' => false],
            ['name' => 'Tafilalet', 'type' => 'Deluxe',       'occupied' => false],
            ['name' => 'Ourika',    'type' => 'Standard',     'occupied' => false],
            ['name' => 'Fès',       'type' => 'Junior Suite', 'occupied' => false],
        ];

        $now = now();
        $rooms = [];
        foreach ($roomDefs as $def) {
            $isOccupied = $def['occupied'];
            $room = Room::create([
                'riad_id' => $riad->id,
                'room_number' => $def['name'],
                'type' => $def['type'],
                'qr_token' => Str::random(32),
                'status' => $isOccupied ? 'occupied' : 'vacant',
                'session_status' => $isOccupied ? 'active' : 'expired',
                'current_session_id' => $isOccupied ? Str::random(16) : null,
                'checked_in_at' => $isOccupied ? $now->copy()->subDays(rand(1, 5)) : null,
            ]);
            $rooms[] = $room;
        }

        $occupiedRooms = array_filter($rooms, fn($r) => $r->status === 'occupied');
        $vacantRooms = array_filter($rooms, fn($r) => $r->status === 'vacant');

        // ─── 4. MENU ────────────────────────────────────────────
        $breakfastCat = Category::create(['riad_id' => $riad->id, 'name' => 'Breakfast & Pastries', 'type' => 'menu', 'sort_order' => 1]);
        $cuisineCat = Category::create(['riad_id' => $riad->id, 'name' => 'Moroccan Cuisine', 'type' => 'menu', 'sort_order' => 2]);
        $drinksCat = Category::create(['riad_id' => $riad->id, 'name' => 'Drinks & Refreshments', 'type' => 'menu', 'sort_order' => 3]);
        $dessertCat = Category::create(['riad_id' => $riad->id, 'name' => 'Desserts', 'type' => 'menu', 'sort_order' => 4]);

        $menuSeed = [
            // [category, name, description, price, is_available, image_category]
            [$breakfastCat, 'Moroccan Breakfast',       'Traditional msemen, baghrir, olive oil, honey, fresh cheese, and mint tea.',                             85,  true,  'breakfast'],
            [$breakfastCat, 'Baghrir (1000 Pancakes)',  'Spongy semolina pancakes served with honey butter and warm syrup.',                                           55,  true,  'breakfast'],
            [$breakfastCat, 'Msemen',                   'Square-shaped folded Moroccan pancakes with honey and melted cheese.',                                         45,  true,  'breakfast'],
            [$breakfastCat, 'Berber Omelette',          'Eggs cooked with tomatoes, peppers, onions, and Moroccan spices.',                                              65,  true,  'breakfast'],
            [$breakfastCat, 'Fresh Fruit Platter',      'Seasonal Moroccan fruits — oranges, figs, melon, and pomegranate.',                                             75,  true,  'breakfast'],
            [$breakfastCat, 'Avocado Smoothie Bowl',    'Creamy avocado blended with almond milk, topped with granola and honey.',                                       85,  false, 'breakfast'],
            [$breakfastCat, 'Sfenj (Moroccan Donuts)',  'Light and airy fried dough dusted with sugar and cinnamon.',                                                    40,  true,  'breakfast'],
            [$cuisineCat,   'Chicken Tagine',           'Slow-cooked chicken with preserved lemon, olives, and saffron.',                                               120, true,  'tagine'],
            [$cuisineCat,   'Lamb Tagine with Prunes',  'Tender lamb cooked with prunes, almonds, and sesame seeds.',                                                   150, true,  'tagine'],
            [$cuisineCat,   'Beef Tagine with Vegetables', 'Seasonal vegetables cooked with tender beef and aromatic spices.',                                         130, true,  'tagine'],
            [$cuisineCat,   'Couscous Royale',          'Traditional couscous with lamb, chicken, and seven seasonal vegetables.',                                      160, true,  'couscous'],
            [$cuisineCat,   'Chicken Pastilla',         'Crispy phyllo pastry filled with spiced chicken, almonds, and cinnamon.',                                       145, true,  'tagine'],
            [$cuisineCat,   'Harira',                   'Traditional soup with tomatoes, lentils, chickpeas, and lamb.',                                                 55,  true,  'tagine'],
            [$cuisineCat,   'Tanjia',                   'Slow-cooked beef in clay pot with cumin, saffron, and preserved lemon.',                                        140, false, 'tagine'],
            [$cuisineCat,   'Kefta & Egg Tagine',       'Spiced meatballs in tomato sauce with cracked eggs and fresh bread.',                                           95,  true,  'tagine'],
            [$drinksCat,    'Moroccan Mint Tea',        'Fresh spearmint, premium green tea, and sugar — poured from height.',                                           25,  true,  'tea'],
            [$drinksCat,    'Fresh Orange Juice',       'Pressed Moroccan oranges from the Ourika Valley.',                                                              35,  true,  'juice'],
            [$drinksCat,    'Almond Milk',              'Traditional Moroccan almond drink with orange blossom water.',                                                  30,  true,  'tea'],
            [$drinksCat,    'Moroccan Coffee',          'Rich coffee spiced with cardamom and a hint of cinnamon.',                                                       30,  true,  'tea'],
            [$drinksCat,    'Lemon Mint Zest',          'Fresh lemonade blended with garden mint and honey.',                                                             30,  true,  'juice'],
            [$drinksCat,    'Bottled Water (1L)',       'Natural spring water sourced from the Middle Atlas.',                                                            15,  true,  'tea'],
            [$dessertCat,   'Moroccan Pastries Assortment', 'Chebakia, ghriba, briouats, and fekkas — served with mint tea.',                                            60,  true,  'pastries'],
            [$dessertCat,   'Orange Blossom Salad',     'Fresh oranges with cinnamon, orange blossom water, almonds, and dates.',                                        50,  true,  'pastries'],
            [$dessertCat,   'Almond Briouats',          'Crispy fried triangles filled with almonds, orange blossom, and honey.',                                        55,  true,  'pastries'],
            [$dessertCat,   'Chebakia',                 'Sesame flower cookies fried and coated in honey.',                                                               45,  true,  'pastries'],
            [$dessertCat,   'Seasonal Sorbet',          'House-made Moroccan fruit sorbet — orange, pomegranate, or fig.',                                                40,  true,  'pastries'],
        ];

        $menuItems = collect();
        foreach ($menuSeed as $s) {
            $menuItems->push(MenuItem::create([
                'riad_id' => $riad->id,
                'category_id' => $s[0]->id,
                'name' => $s[1],
                'description' => $s[2],
                'price' => $s[3],
                'image_url' => $this->img($s[5]),
                'is_available' => $s[4],
            ]));
        }

        // ─── 5. SERVICES ───────────────────────────────────────
        $wellnessCat = Category::create(['riad_id' => $riad->id, 'name' => 'Wellness & Spa', 'type' => 'service', 'sort_order' => 1]);
        $conciergeCat = Category::create(['riad_id' => $riad->id, 'name' => 'Concierge & Transport', 'type' => 'service', 'sort_order' => 2]);
        $housekeepingCat = Category::create(['riad_id' => $riad->id, 'name' => 'Housekeeping', 'type' => 'service', 'sort_order' => 3]);

        $serviceSeed = [
            [$wellnessCat,     'Traditional Hammam',       'Authentic Moroccan hammam with black soap, exfoliation, and argan oil.',           250,  true,  false, 'spa'],
            [$wellnessCat,     'Argan Oil Massage (60 min)','Full-body deep tissue massage using pure argan oil.',                               400,  true,  false, 'spa'],
            [$wellnessCat,     'Moroccan Facial',          'Ghassoul clay mask with rose water and orange blossom toner.',                        300,  true,  false, 'spa'],
            [$wellnessCat,     'Couples Massage (90 min)', 'Side-by-side massage for two with aromatherapy oils.',                                700,  false, false, 'spa'],
            [$wellnessCat,     'Rose Petals Bath',         'Warm bath with fresh rose petals, milk, and honey.',                                  150,  true,  false, 'spa'],
            [$conciergeCat,    'Airport Transfer',         'Private transfer from Marrakech Menara Airport in a luxury vehicle.',                 200,  true,  true,  'transport'],
            [$conciergeCat,    'Private Driver (Half Day)','Personal driver with vehicle for up to 4 hours of exploration.',                     500,  true,  false, 'transport'],
            [$conciergeCat,    'Certified Guide',          'Local expert guide for Medina tours and souk shopping.',                              350,  false, false, 'medina'],
            [$conciergeCat,    'Babysitting Service',      'Experienced sitter for your children in-room.',                                       150,  true,  true,  'transport'],
            [$conciergeCat,    'Laundry Service',          'Next-day laundry, dry cleaning, and pressing per item.',                               25,   true,  true,  'laundry'],
            [$housekeepingCat, 'Extra Towels',             'Fresh bath and pool towels delivered to your room.',                                  0,    true,  true,  'laundry'],
            [$housekeepingCat, 'Room Cleaning',            'Additional mid-day room freshening service.',                                         0,    true,  false, 'laundry'],
            [$housekeepingCat, 'Turn-down Service',        'Evening bed preparation with mint tea and Moroccan pastries.',                        0,    true,  false, 'laundry'],
            [$housekeepingCat, 'Late Check-out (3 PM)',    'Extend your stay until 3:00 PM on departure day.',                                    200,  true,  false, 'laundry'],
            [$housekeepingCat, 'Extra Bed',                'Rollaway bed setup with premium linens.',                                             250,  true,  true,  'laundry'],
        ];

        $services = collect();
        foreach ($serviceSeed as $s) {
            $services->push(Service::create([
                'riad_id' => $riad->id,
                'category_id' => $s[0]->id,
                'name' => $s[1],
                'description' => $s[2],
                'price' => $s[3],
                'is_available' => $s[4],
                'requires_quantity' => $s[5],
                'image_url' => $this->img($s[6]),
            ]));
        }

        // ─── 6. EXCURSIONS ──────────────────────────────────────
        $excursionSeed = [
            ['Atlas Mountains & Berber Villages', 'Full-day journey through the High Atlas. Visit Berber villages and share lunch with a local family.',                                             550,  'Full Day',  true,  'mountains'],
            ['Ourika Valley Waterfalls',          'Hike through argan forests to stunning waterfalls. Cool off in natural pools.',                                                                   400,  'Half Day',  true,  'valley'],
            ['Agafay Desert Sunset & Dinner',     'Camel ride across the rocky desert, followed by dinner under the stars with live music.',                                                        650,  'Half Day',  true,  'desert'],
            ['Hot Air Balloon over Marrakech',    'Sunrise flight over the red city. Champagne breakfast upon landing.',                                                                            2000, '3 Hours',   false, 'balloon'],
            ['Medina Cultural Walking Tour',      'Hidden alleys, historic palaces, souks, and artisan workshops with a local guide.',                                                              300,  '3 Hours',   true,  'medina'],
            ['Majorelle Garden & YSL Museum',     'Visit the iconic blue Majorelle Garden and the Yves Saint Laurent Museum.',                                                                     250,  'Half Day',  true,  'medina'],
            ['Camel Ride in Palmeraie',           'Sunset camel trek through the palm groves with mint tea.',                                                                                       350,  '2 Hours',   true,  'camel'],
            ['Ouzoud Waterfalls Day Trip',        'Morocco\'s most spectacular falls. Spot Barbary apes and enjoy a riverside lunch.',                                                              600,  'Full Day',  false, 'waterfall'],
        ];

        $excursions = collect();
        foreach ($excursionSeed as $s) {
            $excursions->push(Excursion::create([
                'riad_id' => $riad->id,
                'name' => $s[0],
                'description' => $s[1],
                'price' => $s[2],
                'duration' => $s[3],
                'is_available' => $s[4],
                'image_url' => $this->img($s[5]),
            ]));
        }

        // ─── 7. HOUSE RULES ─────────────────────────────────────
        $ruleSeed = [
            ['Breakfast Hours',     'Breakfast is served daily on the rooftop terrace from 7:00 AM to 11:00 AM.',               '7:00 AM – 11:00 AM', 'Clock'],
            ['Rooftop Terrace',     'The rooftop terrace is open from 8:00 AM to 10:00 PM.',                                     '8:00 AM – 10:00 PM', 'Sun'],
            ['Quiet Hours',         'Please keep noise to a minimum between 10:00 PM and 7:00 AM.',                              '10:00 PM – 7:00 AM', 'Moon'],
            ['Pool Rules',          'The courtyard pool is open 8:00 AM to 8:00 PM. Swimwear required.',                         'Open 8 AM – 8 PM',    'Droplets'],
            ['Smoking Policy',      'Smoking is permitted only in the designated areas on the rooftop terrace.',                 'Rooftop only',        'Ban'],
            ['Visitor Policy',      'Guests may receive visitors in common areas until 9:00 PM.',                                'Until 9:00 PM',       'Users'],
            ['Check-out Time',      'Check-out is at 12:00 PM. Late check-out until 3 PM available at a fee.',                  '12:00 PM (noon)',     'Clock'],
            ['Respect Local Culture','When leaving the riad, we recommend modest dress covering shoulders and knees.',             'Modest dress',        'Heart'],
        ];

        foreach ($ruleSeed as $i => $r) {
            HouseRule::create([
                'riad_id' => $riad->id,
                'title' => $r[0],
                'description' => $r[1],
                'value' => $r[2],
                'icon' => $r[3],
                'is_active' => true,
                'sort_order' => $i,
            ]);
        }

        // ─── 8. BUILD LOOKUPS ────────────────────────────────────
        $itemIndex = [];
        foreach ($menuItems as $m) { $itemIndex['menu'][$m->id] = ['name' => $m->name, 'price' => (float) $m->price]; }
        foreach ($services as $s) { $itemIndex['service'][$s->id] = ['name' => $s->name, 'price' => (float) ($s->price ?? 0)]; }
        foreach ($excursions as $e) { $itemIndex['excursion'][$e->id] = ['name' => $e->name, 'price' => (float) $e->price]; }

        $menuIds = $menuItems->pluck('id')->toArray();
        $serviceIds = $services->pluck('id')->toArray();
        $excursionIds = $excursions->pluck('id')->toArray();

        $pickType = fn() => fake()->randomElement(['menu', 'service', 'excursion']);
        $pickItemId = fn(string $type) => fake()->randomElement(match ($type) {
            'menu' => $menuIds,
            'service' => $serviceIds,
            'excursion' => $excursionIds,
        });
        $pickRoom = fn() => $rooms[array_rand($rooms)];

        $buildRequest = function (string $status, $room, string $type, ?int $itemId, $completedAt, $createdAt) use ($riad, $itemIndex, $pickItemId) {
            $itemId = $itemId ?? $pickItemId($type);
            $item = $itemIndex[$type][$itemId] ?? ['name' => 'Deleted Item', 'price' => 0];
            $qty = $type === 'service' ? rand(1, 3) : rand(1, 4);
            $unitPrice = $item['price'];
            $totalPrice = $unitPrice * $qty;

            return GuestRequest::create([
                'riad_id' => $riad->id,
                'room_id' => $room->id,
                'session_id' => Str::random(20),
                'type' => $type,
                'item_id' => $itemId,
                'item_name' => $item['name'],
                'unit_price' => $unitPrice,
                'quantity' => $qty,
                'total_price' => $totalPrice,
                'notes' => fake()->boolean(30) ? fake()->randomElement($this->notesPool) : null,
                'status' => $status,
                'completed_at' => $completedAt,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        };

        // ─── 9. GUEST REQUESTS ──────────────────────────────────
        $today = now()->startOfDay();

        // Today: active requests for occupied rooms
        foreach ($occupiedRooms as $room) {
            for ($j = 0; $j < rand(1, 2); $j++) {
                $buildRequest('pending', $room, fake()->randomElement(['menu', 'service']), null, null, $today);
            }
            for ($j = 0; $j < rand(1, 2); $j++) {
                $buildRequest('in_progress', $room, $pickType(), null, null, $today->copy()->subHours(rand(1, 5)));
            }
            for ($j = 0; $j < rand(1, 2); $j++) {
                $h = rand(2, 10);
                $buildRequest('completed', $room, $pickType(), null, $today->copy()->subHours($h), $today->copy()->subHours($h + 1));
            }
        }

        // Recent checkouts (past 3 days)
        foreach (array_slice($vacantRooms, 0, 3) as $room) {
            $day = $today->copy()->subDays(rand(0, 2));
            $count = rand(2, 4);
            for ($j = 0; $j < $count; $j++) {
                $h = rand(1, 12);
                $type = $pickType();
                $buildRequest('completed', $room, $type, null, $day->copy()->addHours($h + rand(0, 3)), $day->copy()->addHours($h));
            }
        }

        // Historical: 140 requests across 6 months
        for ($i = 0; $i < 140; $i++) {
            $isCompleted = fake()->boolean(78);
            $status = $isCompleted ? 'completed' : 'cancelled';
            $type = $pickType();
            $room = $pickRoom();
            $daysAgo = rand(3, 180);
            $createdAt = $today->copy()->subDays($daysAgo)->addHours(rand(8, 22));
            $completedAt = $status === 'completed' ? $createdAt->copy()->addMinutes(rand(15, 180)) : null;
            $buildRequest($status, $room, $type, null, $completedAt, $createdAt);
        }

        // Extra recent cancellations (last 2 weeks)
        for ($i = 0; $i < 15; $i++) {
            $createdAt = $today->copy()->subDays(rand(0, 14))->addHours(rand(9, 21));
            $buildRequest('cancelled', $pickRoom(), $pickType(), null, null, $createdAt);
        }

        // ─── 10. NOTIFICATIONS ──────────────────────────────────
        $allRequests = GuestRequest::where('riad_id', $riad->id)
            ->whereIn('status', ['completed', 'cancelled'])
            ->orderBy('created_at', 'desc')
            ->get();

        foreach ($allRequests as $req) {
            if ($req->status === 'completed') {
                $label = match ($req->type) { 'menu' => 'Food Order Completed', 'service' => 'Service Completed', 'excursion' => 'Excursion Completed' };
                Notification::create([
                    'riad_id' => $riad->id,
                    'type' => 'order_completed',
                    'title' => $label,
                    'description' => "Room {$req->room->room_number} — {$req->quantity}× {$req->item_name}.",
                    'is_read' => fake()->boolean(70),
                    'data' => ['entity_type' => 'guest_request', 'entity_id' => $req->id, 'room_number' => $req->room->room_number, 'item_name' => $req->item_name, 'status' => 'completed'],
                    'created_at' => $req->completed_at ?? $req->created_at,
                    'updated_at' => $req->completed_at ?? $req->created_at,
                ]);
            } else {
                $label = match ($req->type) { 'menu' => 'Food Order Cancelled', 'service' => 'Service Cancelled', 'excursion' => 'Excursion Cancelled' };
                Notification::create([
                    'riad_id' => $riad->id,
                    'type' => 'order_cancelled',
                    'title' => $label,
                    'description' => "Room {$req->room->room_number} — {$req->item_name} was cancelled.",
                    'is_read' => fake()->boolean(60),
                    'data' => ['entity_type' => 'guest_request', 'entity_id' => $req->id, 'room_number' => $req->room->room_number, 'item_name' => $req->item_name, 'status' => 'cancelled'],
                    'created_at' => $req->created_at,
                    'updated_at' => $req->created_at,
                ]);
            }
        }

        // Check-in / check-out notifications
        foreach ($occupiedRooms as $room) {
            $t = $room->checked_in_at ?? $today->copy()->subDays(rand(1, 4));
            Notification::create([
                'riad_id' => $riad->id,
                'type' => 'guest_checked_in',
                'title' => 'Guest Checked In',
                'description' => "Room {$room->room_number} — guest checked in.",
                'is_read' => true,
                'data' => ['entity_type' => 'room', 'entity_id' => $room->id, 'room_number' => $room->room_number],
                'created_at' => $t,
                'updated_at' => $t,
            ]);
        }

        foreach (array_slice($vacantRooms, 0, 3) as $room) {
            $t = $today->copy()->subDays(rand(0, 2))->addHours(rand(10, 14));
            Notification::create([
                'riad_id' => $riad->id,
                'type' => 'guest_checked_out',
                'title' => 'Guest Checked Out',
                'description' => "Room {$room->room_number} — guest checked out.",
                'is_read' => true,
                'data' => ['entity_type' => 'room', 'entity_id' => $room->id, 'room_number' => $room->room_number],
                'created_at' => $t,
                'updated_at' => $t,
            ]);
        }

        // ─── SUMMARY ────────────────────────────────────────────
        echo "\n✅ Riad El Fenn seeded successfully!\n";
        echo "   Owner:      youssef@riadelfenn.test / password\n";
        echo "   Reception:  fatima@riadelfenn.test / password\n";
        echo "   Rooms:      " . count($rooms) . " total (" . count($occupiedRooms) . " occupied)\n";
        echo "   Menu:       " . $menuItems->count() . " items\n";
        echo "   Services:   " . $services->count() . "\n";
        echo "   Excursions: " . $excursions->count() . "\n";
        echo "   Requests:   " . GuestRequest::where('riad_id', $riad->id)->count() . "\n";
        echo "   Notifs:     " . Notification::where('riad_id', $riad->id)->count() . "\n";
    }
}
