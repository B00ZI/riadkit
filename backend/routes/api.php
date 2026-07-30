<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExcursionController;
use App\Http\Controllers\Api\GuestRequestController;
use App\Http\Controllers\Api\HouseRuleController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestPortalController;
use App\Http\Controllers\ReceptionController;
use App\Http\Controllers\RiadController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ──────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:login');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

// Guest Portal
Route::get('/guest/portal/{qr_token}', [GuestPortalController::class, 'show']);
Route::post('/guest/requests', [GuestRequestController::class, 'store']);

// ─── Protected Routes (auth required, both owner and receptionist) ──
Route::middleware('auth:sanctum')->group(function () {

    // ✅ FIXED: Explicitly register broadcasting routes with auth:sanctum middleware
    Broadcast::routes(['middleware' => ['auth:sanctum']]);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Account management
    Route::get('/account', [AccountController::class, 'show']);
    Route::put('/account/profile', [AccountController::class, 'updateProfile']);
    Route::put('/account/password', [AccountController::class, 'updatePassword']);
    Route::delete('/account', [AccountController::class, 'destroy']);

    // Riad settings (view only)
    Route::get('/settings', [RiadController::class, 'show']);

    // Rooms (view only)
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/print-batch', [RoomController::class, 'printBatch']);
    Route::get('/rooms/{room}/print-data', [RoomController::class, 'printData']);

    // Reception operations
    Route::post('/rooms/{room}/checkin', [ReceptionController::class, 'checkIn']);
    Route::post('/rooms/{room}/checkout', [ReceptionController::class, 'checkOut']);

    // Requests (view and update status)
    Route::get('/requests', [GuestRequestController::class, 'index']);
    Route::patch('/requests/{guestRequest}', [GuestRequestController::class, 'update']);

    // Catalog: GET & PUT
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);

    Route::get('/menu-items', [MenuItemController::class, 'index']);
    Route::get('/menu-items/{menuItem}', [MenuItemController::class, 'show']);

    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);

    Route::get('/excursions', [ExcursionController::class, 'index']);
    Route::get('/excursions/{excursion}', [ExcursionController::class, 'show']);

    Route::get('/house-rules', [HouseRuleController::class, 'index']);
    Route::get('/house-rules/{houseRule}', [HouseRuleController::class, 'show']);

    Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::put('/excursions/{excursion}', [ExcursionController::class, 'update']);
    Route::put('/house-rules/{houseRule}', [HouseRuleController::class, 'update']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});

// ─── Owner‑Only Routes ──────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    Route::put('/settings', [RiadController::class, 'update']);

    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::delete('/menu-items/{menuItem}', [MenuItemController::class, 'destroy']);

    Route::post('/services', [ServiceController::class, 'store']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    Route::post('/excursions', [ExcursionController::class, 'store']);
    Route::delete('/excursions/{excursion}', [ExcursionController::class, 'destroy']);

    Route::post('/house-rules', [HouseRuleController::class, 'store']);
    Route::delete('/house-rules/{houseRule}', [HouseRuleController::class, 'destroy']);

    // Image upload
    Route::post('/upload', [UploadController::class, 'store']);
    Route::delete('/uploads', [UploadController::class, 'destroy']);

    Route::prefix('staff')->group(function () {
        Route::get('/', [StaffController::class, 'index']);
        Route::post('/', [StaffController::class, 'store']);
        Route::put('/{staff}', [StaffController::class, 'update']);
        Route::delete('/{staff}', [StaffController::class, 'destroy']);
    });
});