<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RiadController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ReceptionController; // Added missing import
use App\Http\Controllers\GuestSessionController; // Added missing import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/guest/bootstrap', [GuestSessionController::class, 'bootstrap']); // Added missing route

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
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

    // Reception Operations
    Route::post('/rooms/{roomId}/checkout', [ReceptionController::class, 'checkout']);
    Route::post('/rooms/{roomId}/checkin', [ReceptionController::class, 'checkin']);
});