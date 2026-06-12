<?php
namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\GuestSession;
use App\Models\Category;
use App\Models\Service;
use App\Models\Excursion;
use Illuminate\Http\Request;

class GuestSessionController extends Controller
{
    public function show(Request $request)
    {
        $validated = $request->validate([
            'qr_token' => 'required|string',
            'session_id' => 'nullable|integer' // Accept the old session cookie
        ]);

        // Fetch Room with its Riad relation
        $room = Room::with('riad')->where('qr_token', $validated['qr_token'])->first();
        if (!$room) {
            return response()->json(['message' => 'Invalid QR Code'], 404);
        }

        $riad = $room->riad;

        // Fetch Public Portal Data (Always visible to anyone in the room)
        $menu = Category::where('riad_id', $riad->id)
            ->where('type', 'menu')
            ->orderBy('sort_order')
            ->with(['menuItems' => function ($query) {
                $query->where('is_available', true);
            }])
            ->get();

        $services = Service::where('riad_id', $riad->id)
            ->where('is_available', true)
            ->get();

        $excursions = Excursion::where('riad_id', $riad->id)
            ->where('is_available', true)
            ->get();

        // Base payload always returned
        $payload = [
            'room_id' => $room->id,
            'room_number' => $room->room_number,
            'riad' => [
                'name' => $riad->name,
                'logoUrl' => $riad->logoUrl,
                'description' => $riad->description,
                'wifiName' => $riad->wifiName,
                'wifiPassword' => $riad->wifiPassword,
                'whatsappNumber' => $riad->whatsappNumber,
                'instagramUrl' => $riad->instagramUrl,
                'currency' => $riad->currency ?? 'MAD',
            ],
            'menu' => $menu,
            'services' => $services,
            'excursions' => $excursions,
        ];

        // 1. �️ STICKY TOKEN DEFENSE: Check their specific cookie first
        if ($request->filled('session_id')) {
            $existingSession = GuestSession::where('id', $validated['session_id'])
                                           ->where('room_id', $room->id)
                                           ->first();

            // If their exact session is expired, they remain permanently blocked from ordering
            if ($existingSession && $existingSession->status === 'expired') {
                return response()->json(array_merge($payload, [
                    'session_id' => $existingSession->id,
                    'session_status' => 'expired'
                ]));
            }
        }

        // 2. Otherwise, look for the current active session for this room
        $session = GuestSession::where('room_id', $room->id)
                               ->where('status', 'active')
                               ->latest()
                               ->first();

        if (!$session) {
            return response()->json(array_merge($payload, [
                'session_id' => null,
                'session_status' => 'expired'
            ]));
        }

        return response()->json(array_merge($payload, [
            'session_id' => $session->id,
            'session_status' => $session->status
        ]));
    }
}