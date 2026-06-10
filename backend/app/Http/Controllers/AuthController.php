<?php

namespace App\Http\Controllers;

use App\Models\Riad;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validate incoming data
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'riad_name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|max:50'
        ]);

        // 2. Use a transaction to ensure both Riad and User are created safely
        $user = DB::transaction(function () use ($validated) {
            
            // Create the Riad first
            $riad = Riad::create([
                'name' => $validated['riad_name'],
                'whatsappNumber' => $validated['whatsapp_number'],
            ]);

            // Create the Owner and link to the Riad
            return User::create([
                'name' => $validated['user_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'riad_id' => $riad->id,
                'role' => 'owner', // Default role
            ]);
        });

        // 3. Generate a Sanctum Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Return the token and user data to Next.js
        return response()->json([
            'message' => 'Registration successful',
            'access_token' => $token,
            'user' => $user->load('riad'), // Loads the associated riad data
        ], 201);
    }
}