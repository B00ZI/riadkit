<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExcursionController;
use App\Http\Controllers\Api\GuestRequestController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestPortalController;
use App\Http\Controllers\ReceptionController;
use App\Http\Controllers\RiadController;
use App\Http\Controllers\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Guest Portal Route
Route::get('/guest/portal/{qr_token}', [GuestPortalController::class, 'show']);
Route::post('/guest/requests', [GuestRequestController::class, 'store']);

// Protected Routes (Require Sanctum Token for Owners/Staff)
Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    // Riad Settings (only owner should update)
    Route::put('/settings', [RiadController::class, 'update']);

    // Rooms – only owner can create/update/delete
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

    // Full catalog management (categories, menu-items, services, excursions)
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('menu-items', MenuItemController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('excursions', ExcursionController::class);

    Route::prefix('staff')->group(function () {
        Route::get('/', [StaffController::class, 'index']);
        Route::post('/', [StaffController::class, 'store']);
        Route::put('/{id}', [StaffController::class, 'update']);
        Route::delete('/{id}', [StaffController::class, 'destroy']);
    });
});

// Routes accessible by both owner and receptionist
Route::middleware(['auth:sanctum', 'role:owner, receptionist'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/settings', [RiadController::class, 'show']); // view settings

    Route::get('/rooms', [RoomController::class, 'index']); // both can view rooms

    // Reception operations
    Route::post('/rooms/{room}/checkin', [ReceptionController::class, 'checkIn']);
    Route::post('/rooms/{room}/checkout', [ReceptionController::class, 'checkOut']);

    Route::get('/requests', [GuestRequestController::class, 'index']);
    Route::patch('/requests/{id}', [GuestRequestController::class, 'update']);
});
