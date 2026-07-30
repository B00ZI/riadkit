<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Excursion;
use App\Models\GuestRequest;
use App\Models\MenuItem;
use App\Models\Notification;
use App\Models\Room;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $riadId = $request->user()->riad_id;

        // ─── 1. ROOM STATS ─────────────────────────────────────
        $totalRooms = Room::where('riad_id', $riadId)->count();
        $activeRooms = Room::where('riad_id', $riadId)->where('status', 'occupied')->count();
        $occupancy = $totalRooms > 0 ? round(($activeRooms / $totalRooms) * 100) : 0;

        // ─── 2. TODAY'S ORDER STATUS COUNTS ────────────────────
        $todayStart = now()->startOfDay();
        $statusCounts = GuestRequest::where('riad_id', $riadId)
            ->where('created_at', '>=', $todayStart)
            ->selectRaw("status, COUNT(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status');

        $orderStatus = [
            'pending' => $statusCounts->get('pending', 0),
            'in_progress' => $statusCounts->get('in_progress', 0),
            'completed' => $statusCounts->get('completed', 0),
            'cancelled' => $statusCounts->get('cancelled', 0),
        ];

        // ─── 3. REVENUE (completed only, based on completed_at) ─
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();
        $tomorrow = now()->addDay()->startOfDay();

        $completedRequests = GuestRequest::where('riad_id', $riadId)
            ->where('status', 'completed')
            ->whereNotNull('completed_at')
            ->get(['id', 'type', 'total_price', 'completed_at']);

        // Month labels
        $monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Initialize last 6 months
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = now()->subMonths($i);
            $key = $d->format('Y-m');
            $monthlyRevenue[$key] = [
                'month' => $monthNames[$d->month - 1],
                'menu' => 0,
                'services' => 0,
                'excursions' => 0,
                'total' => 0,
            ];
        }

        // Initialize last 7 days
        $dailyRevenue = [];
        for ($i = 0; $i < 7; $i++) {
            $d = now()->subDays($i);
            $key = $d->format('Y-m-d');
            $label = $i === 0 ? 'Today' : ($i === 1 ? 'Yesterday' : $d->format('M j'));
            $dailyRevenue[$key] = [
                'dateLabel' => $label,
                'rawDate' => $key,
                'total' => 0,
                'orders' => 0,
                'menu' => 0,
                'services' => 0,
                'excursions' => 0,
            ];
        }

        $todayRevenue = 0;
        $yesterdayRevenue = 0;

        foreach ($completedRequests as $req) {
            $amount = (float) ($req->total_price ?? 0);
            $compDate = $req->completed_at;
            $compDateStr = $compDate->format('Y-m-d');
            $monthKey = $compDate->format('Y-m');

            // Today / Yesterday
            if ($compDate >= $today && $compDate < $tomorrow) {
                $todayRevenue += $amount;
            }
            if ($compDate >= $yesterday && $compDate < $today) {
                $yesterdayRevenue += $amount;
            }

            // Monthly
            if (isset($monthlyRevenue[$monthKey])) {
                $monthlyRevenue[$monthKey][$req->type === 'menu' ? 'menu' : ($req->type === 'service' ? 'services' : 'excursions')] += $amount;
                $monthlyRevenue[$monthKey]['total'] += $amount;
            }

            // Daily
            if (isset($dailyRevenue[$compDateStr])) {
                $dailyRevenue[$compDateStr]['total'] += $amount;
                $dailyRevenue[$compDateStr]['orders'] += 1;
                $typeKey = $req->type === 'menu' ? 'menu' : ($req->type === 'service' ? 'services' : 'excursions');
                $dailyRevenue[$compDateStr][$typeKey] += $amount;
            }
        }

        // Growth
        $growth = 0;
        if ($yesterdayRevenue > 0) {
            $growth = round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 1);
        } elseif ($todayRevenue > 0) {
            $growth = 100;
        }

        // ─── 4. OUT OF STOCK / UNAVAILABLE ITEMS ───────────────
        $unavailableMenu = MenuItem::where('riad_id', $riadId)
            ->where('is_available', false)
            ->get(['id', 'name'])
            ->map(fn($i) => ['id' => $i->id, 'name' => $i->name, 'type' => 'menu']);

        $unavailableServices = Service::where('riad_id', $riadId)
            ->where('is_available', false)
            ->get(['id', 'name'])
            ->map(fn($i) => ['id' => $i->id, 'name' => $i->name, 'type' => 'service']);

        $unavailableExcursions = Excursion::where('riad_id', $riadId)
            ->where('is_available', false)
            ->get(['id', 'name'])
            ->map(fn($i) => ['id' => $i->id, 'name' => $i->name, 'type' => 'excursion']);

        $unavailableItems = $unavailableMenu
            ->concat($unavailableServices)
            ->concat($unavailableExcursions)
            ->values();

        // ─── 5. RECENT NOTIFICATIONS ───────────────────────────
        $recentNotifications = Notification::where('riad_id', $riadId)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'type', 'title', 'description', 'is_read', 'data', 'created_at']);

        // ─── RESPONSE ──────────────────────────────────────────
        return response()->json([
            'todayRevenue' => $todayRevenue,
            'yesterdayRevenue' => $yesterdayRevenue,
            'growth' => $growth,
            'activeRooms' => $activeRooms,
            'totalRooms' => $totalRooms,
            'occupancy' => $occupancy,
            'orderStatus' => $orderStatus,
            'monthlyRevenue' => array_values($monthlyRevenue),
            'dailyRevenue' => array_values($dailyRevenue),
            'unavailableItems' => $unavailableItems,
            'recentNotifications' => $recentNotifications,
        ]);
    }
}
