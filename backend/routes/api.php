<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExcursionController;
use App\Http\Controllers\Api\GuestRequestController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestPortalController;
use App\Http\Controllers\ReceptionController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\RiadController;
use App\Http\Controllers\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ──────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Guest Portal
Route::get('/guest/portal/{qr_token}', [GuestPortalController::class, 'show']);
Route::post('/guest/requests', [GuestRequestController::class, 'store']);

// ─── Protected Routes (auth required, both owner and receptionist) ──
Route::middleware('auth:sanctum')->group(function () {

    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Riad settings (view only)
    Route::get('/settings', [RiadController::class, 'show']);

    // Rooms (view only)
    Route::get('/rooms', [RoomController::class, 'index']);

    // Reception operations
    Route::post('/rooms/{room}/checkin', [ReceptionController::class, 'checkIn']);
    Route::post('/rooms/{room}/checkout', [ReceptionController::class, 'checkOut']);

    // Requests (view and update status)
    Route::get('/requests', [GuestRequestController::class, 'index']);
    Route::patch('/requests/{id}', [GuestRequestController::class, 'update']); // keep as is

    // ─── Catalog: GET & PUT (both roles) ──────────────────
    // GET for all catalog resources (now with model binding)
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);

    Route::get('/menu-items', [MenuItemController::class, 'index']);
    Route::get('/menu-items/{menuItem}', [MenuItemController::class, 'show']);

    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);

    Route::get('/excursions', [ExcursionController::class, 'index']);
    Route::get('/excursions/{excursion}', [ExcursionController::class, 'show']);

    // PUT (toggle availability) – allow both owner and receptionist
    Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::put('/excursions/{excursion}', [ExcursionController::class, 'update']);
});

// ─── Owner‑Only Routes ──────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {

    // Riad settings (update)
    Route::put('/settings', [RiadController::class, 'update']);

    // Rooms (create, update, delete) – now using {room}
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);

    // ─── Catalog: POST, DELETE (owner only) ──────────────
    // Categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Menu-items (POST and DELETE only; PUT is already outside)
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::delete('/menu-items/{menuItem}', [MenuItemController::class, 'destroy']);

    // Services (POST, DELETE; PUT is outside)
    Route::post('/services', [ServiceController::class, 'store']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    // Excursions (POST, DELETE; PUT is outside)
    Route::post('/excursions', [ExcursionController::class, 'store']);
    Route::delete('/excursions/{excursion}', [ExcursionController::class, 'destroy']);

    // Staff management
    Route::prefix('staff')->group(function () {
        Route::get('/', [StaffController::class, 'index']);
        Route::post('/', [StaffController::class, 'store']);
        Route::put('/{staff}', [StaffController::class, 'update']);
        Route::delete('/{staff}', [StaffController::class, 'destroy']);
    });
});