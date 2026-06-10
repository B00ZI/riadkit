<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/handshake-test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Hello from Marrakech! Laravel and Next.js are officially talking.'
    ]);
});