<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RiadController extends Controller
{
    // Fetch the current Riad settings
    public function show(Request $request)
    {
        // $request->user() automatically gets the logged-in owner based on the Sanctum token!
        $user = $request->user()->load('riad');
        
        return response()->json([
            'riad' => $user->riad
        ]);
    }

    // Update the Riad settings
    public function update(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'wifiName' => 'nullable|string|max:255',
            'wifiPassword' => 'nullable|string|max:255',
            'whatsappNumber' => 'required|string|max:255',
            'instagramUrl' => 'nullable|url|max:255', // Validates it's a real URL
        ]);

        // 2. Get the specific Riad owned by the logged-in user
        $riad = $request->user()->riad;

        // 3. Update the database
        $riad->update($validated);

        return response()->json([
            'message' => 'Settings updated successfully',
            'riad' => $riad
        ]);
    }
}