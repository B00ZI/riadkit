<?php

namespace App\Http\Controllers\Api;

use App\Events\ItemAvailabilityChanged;
use App\Events\NewNotification;
use App\Http\Controllers\Controller;
use App\Models\Excursion;
use App\Models\Notification;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class ExcursionController extends Controller
{
    public function index(Request $request)
    {
        $excursions = Excursion::where('riad_id', $request->user()->riad_id)->get();

        return response()->json($excursions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'image_url' => 'nullable|string',
            'image_public_id' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $validated['riad_id'] = $request->user()->riad_id;
        $excursion = Excursion::create($validated);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'excursion_created',
            'title' => 'New Excursion Added',
            'description' => "{$excursion->name} excursion is now available.",
            'data' => [
                'entity_type' => 'excursion',
                'entity_id' => $excursion->id,
                'name' => $excursion->name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($excursion, 201);
    }

    public function update(Request $request, Excursion $excursion)
    {
        if ($excursion->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'image_url' => 'nullable|string',
            'image_public_id' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $wasAvailable = $excursion->is_available;
        $oldImagePublicId = $excursion->image_public_id;
        $excursion->update($validated);

        if ($oldImagePublicId && (!$excursion->image_public_id || $excursion->image_public_id !== $oldImagePublicId)) {
            app(ImageUploadService::class)->delete($oldImagePublicId);
        }

        if (array_key_exists('is_available', $validated) && $wasAvailable !== $excursion->is_available) {
            ItemAvailabilityChanged::dispatch('excursion', $excursion->id, $excursion->name, $excursion->is_available, $request->user()->riad_id);
            $type = $excursion->is_available ? 'excursion_restocked' : 'excursion_out_of_stock';
            $title = $excursion->is_available ? 'Excursion Restocked' : 'Excursion Out of Stock';
            $desc = $excursion->is_available
                ? "{$excursion->name} is now available."
                : "{$excursion->name} is no longer available.";
        } else {
            $type = 'excursion_updated';
            $title = 'Excursion Updated';
            $desc = "{$excursion->name} has been updated.";
        }

        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => $type,
            'title' => $title,
            'description' => $desc,
            'data' => [
                'entity_type' => 'excursion',
                'entity_id' => $excursion->id,
                'name' => $excursion->name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($excursion);
    }

    public function destroy(Request $request, Excursion $excursion)
    {
        if ($excursion->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $name = $excursion->name;

        if ($excursion->image_public_id) {
            app(ImageUploadService::class)->delete($excursion->image_public_id);
        }

        $excursion->delete();

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'excursion_deleted',
            'title' => 'Excursion Removed',
            'description' => "{$name} excursion has been removed.",
            'data' => [
                'entity_type' => 'excursion',
                'entity_id' => null,
                'name' => $name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json(['message' => 'Excursion deleted successfully']);
    }
}