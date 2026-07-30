<?php

namespace App\Http\Controllers;

use App\Events\NewNotification;
use App\Models\Notification;
use App\Services\ImageUploadService;
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
            'instagramUrl' => 'nullable|url|max:255',
            'logo_url' => 'nullable|string',
            'logo_public_id' => 'nullable|string',
            'cover_image_url' => 'nullable|string',
            'cover_image_public_id' => 'nullable|string',
        ]);

        // 2. Get the specific Riad owned by the logged-in user
        $riad = $request->user()->riad;

        // 3. Track old public IDs for cleanup
        $oldLogoPublicId = $riad->logo_public_id;
        $oldCoverPublicId = $riad->cover_image_public_id;

        // 4. Update the database
        $riad->update($validated);

        // 5. Delete replaced images from Cloudinary
        if ($oldLogoPublicId && (!$riad->logo_public_id || $riad->logo_public_id !== $oldLogoPublicId)) {
            app(ImageUploadService::class)->delete($oldLogoPublicId);
        }
        if ($oldCoverPublicId && (!$riad->cover_image_public_id || $riad->cover_image_public_id !== $oldCoverPublicId)) {
            app(ImageUploadService::class)->delete($oldCoverPublicId);
        }

        // Notification
        $notification = Notification::create([
            'riad_id' => $riad->id,
            'type' => 'settings_updated',
            'title' => 'Settings Updated',
            'description' => 'Riad settings have been updated.',
            'data' => [
                'entity_type' => 'riad',
                'entity_id' => $riad->id,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Settings updated successfully',
            'riad' => $riad
        ]);
    }
}