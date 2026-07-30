<?php

namespace App\Http\Controllers\Api;

use App\Events\ItemAvailabilityChanged;
use App\Events\NewNotification;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::where('riad_id', $request->user()->riad_id)
            ->with('category')
            ->get();

        return response()->json($services);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_available' => 'boolean',
            'requires_quantity' => 'boolean',
        ]);

        if (!empty($validated['category_id'])) {
            $category = $request->user()->riad->categories()->find($validated['category_id']);
            if (!$category) {
                return response()->json(['message' => 'Invalid category selected'], 422);
            }
        }

        $validated['riad_id'] = $request->user()->riad_id;
        $service = Service::create($validated);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'service_created',
            'title' => 'New Service Added',
            'description' => "{$service->name} is now available.",
            'data' => [
                'entity_type' => 'service',
                'entity_id' => $service->id,
                'name' => $service->name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        if ($service->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_available' => 'boolean',
            'requires_quantity' => 'boolean',
        ]);

        if (array_key_exists('category_id', $validated) && !empty($validated['category_id'])) {
            $category = $request->user()->riad->categories()->find($validated['category_id']);
            if (!$category) {
                return response()->json(['message' => 'Invalid category selected'], 422);
            }
        }

        $wasAvailable = $service->is_available;
        $service->update($validated);

        if (array_key_exists('is_available', $validated) && $wasAvailable !== $service->is_available) {
            ItemAvailabilityChanged::dispatch('service', $service->id, $service->name, $service->is_available, $request->user()->riad_id);
            $type = $service->is_available ? 'service_restocked' : 'service_out_of_stock';
            $title = $service->is_available ? 'Service Restocked' : 'Service Out of Stock';
            $desc = $service->is_available
                ? "{$service->name} is now available."
                : "{$service->name} is no longer available.";
        } else {
            $type = 'service_updated';
            $title = 'Service Updated';
            $desc = "{$service->name} has been updated.";
        }

        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => $type,
            'title' => $title,
            'description' => $desc,
            'data' => [
                'entity_type' => 'service',
                'entity_id' => $service->id,
                'name' => $service->name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($service);
    }

    public function destroy(Request $request, Service $service)
    {
        if ($service->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $name = $service->name;
        $service->delete();

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'service_deleted',
            'title' => 'Service Removed',
            'description' => "{$name} has been removed.",
            'data' => [
                'entity_type' => 'service',
                'entity_id' => null,
                'name' => $name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json(['message' => 'Service deleted successfully']);
    }
}