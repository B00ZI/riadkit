<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RiadController;
use App\Http\Controllers\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Require Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {
    
    // Riad Settings
    Route::get('/settings', [RiadController::class, 'show']);
    Route::put('/settings', [RiadController::class, 'update']);
    

    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);
});

