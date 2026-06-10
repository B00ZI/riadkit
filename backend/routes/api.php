<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RiadController;
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
    
});

Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});