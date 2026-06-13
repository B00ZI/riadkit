<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RiadController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ReceptionController; 
use App\Http\Controllers\GuestPortalController ; 

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ExcursionController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Guest Portal Route
Route::get('/guest/portal/{qr_token}', [GuestPortalController::class, 'show']);



// Protected Routes (Require Sanctum Token for Owners/Staff)
Route::middleware('auth:sanctum')->group(function () {
    
    // User Info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Riad Settings
    Route::get('/settings', [RiadController::class, 'show']);
    Route::put('/settings', [RiadController::class, 'update']);
    
    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

    //manage categories, menu items, services, and excursions
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('menu-items', MenuItemController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('excursions', ExcursionController::class);

    // Reception Operations
    Route::post('/rooms/{room}/checkin', [ReceptionController::class, 'checkIn']);
    Route::post('/rooms/{room}/checkout', [ReceptionController::class, 'checkOut']);
});