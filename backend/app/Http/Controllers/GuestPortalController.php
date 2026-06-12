<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Category;
use App\Models\Service;
use App\Models\Excursion;
use Illuminate\Http\Request;

class GuestPortalController extends Controller
{
    public function show(Request $request, string $qr_token)
    {
        // Find the room using the secure QR token
        $room = Room::with('riad')->where('qr_token', $qr_token)->first();

        if (!$room) {
            return response()->json(['message' => 'Invalid Room Token'], 404);
        }

        $riad = $room->riad;

        // Fetch Public Portal Data
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

        $clientSessionId = $request->query('session_id');

        // �️ STICKY TOKEN DEFENSE: Validate the incoming session cookie
        if ($clientSessionId) {
            // Case A: The cookie matches the room's current session
            if ($clientSessionId === $room->current_session_id) {
                return response()->json(array_merge($payload, [
                    'session_id' => $room->current_session_id,
                    'session_status' => $room->session_status // Can be 'active' or 'expired'
                ]));
            }

            // Case B: Cookie mismatch (Guest belongs to an older, checked-out stay)
            return response()->json(array_merge($payload, [
                'session_id' => $clientSessionId,
                'session_status' => 'expired'
            ]));
        }

        // Case C: No cookie in browser. Return current room's session status.
        // If the room has an active session, the guest frontend will "adopt" this active session ID.
        return response()->json(array_merge($payload, [
            'session_id' => $room->session_status === 'active' ? $room->current_session_id : null,
            'session_status' => $room->session_status
        ]));
    }
}