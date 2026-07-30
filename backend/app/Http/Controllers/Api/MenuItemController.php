<?php

namespace App\Http\Controllers\Api;

use App\Events\ItemAvailabilityChanged;
use App\Events\NewNotification;
use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Notification;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $menuItems = MenuItem::where('riad_id', $request->user()->riad_id)
            ->with('category')
            ->get();

        return response()->json($menuItems);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'image_public_id' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        // Validate that the chosen category belongs to the same Riad
        $category = $request->user()->riad->categories()->find($validated['category_id']);
        if (! $category) {
            return response()->json(['message' => 'Invalid category selected'], 422);
        }

        $validated['riad_id'] = $request->user()->riad_id;
        $menuItem = MenuItem::create($validated);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'menu_item_created',
            'title' => 'New Menu Item Added',
            'description' => "{$menuItem->name} added to the menu.",
            'data' => [
                'entity_type' => 'menu_item',
                'entity_id' => $menuItem->id,
                'name' => $menuItem->name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($menuItem, 201);
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        if ($menuItem->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|string',
            'image_public_id' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        if (isset($validated['category_id'])) {
            $category = $request->user()->riad->categories()->find($validated['category_id']);
            if (! $category) {
                return response()->json(['message' => 'Invalid category selected'], 422);
            }
        }

        $wasAvailable = $menuItem->is_available;
        $oldImagePublicId = $menuItem->image_public_id;
        $menuItem->update($validated);

        if ($oldImagePublicId && (!$menuItem->image_public_id || $menuItem->image_public_id !== $oldImagePublicId)) {
            app(ImageUploadService::class)->delete($oldImagePublicId);
        }

        if (array_key_exists('is_available', $validated) && $wasAvailable !== $menuItem->is_available) {
            ItemAvailabilityChanged::dispatch('menu', $menuItem->id, $menuItem->name, $menuItem->is_available, $request->user()->riad_id);
            $type = $menuItem->is_available ? 'menu_item_restocked' : 'menu_item_out_of_stock';
            $title = $menuItem->is_available ? 'Menu Item Restocked' : 'Menu Item Out of Stock';
            $desc = $menuItem->is_available
                ? "{$menuItem->name} is now available."
                : "{$menuItem->name} is no longer available.";
        } else {
            $type = 'menu_item_updated';
            $title = 'Menu Item Updated';
            $desc = "{$menuItem->name} has been updated.";
        }

        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => $type,
            'title' => $title,
            'description' => $desc,
            'data' => [
                'entity_type' => 'menu_item',
                'entity_id' => $menuItem->id,
                'name' => $menuItem->name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($menuItem);
    }

    public function destroy(Request $request, MenuItem $menuItem)
    {
        if ($menuItem->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $name = $menuItem->name;

        if ($menuItem->image_public_id) {
            app(ImageUploadService::class)->delete($menuItem->image_public_id);
        }

        $menuItem->delete();

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'menu_item_deleted',
            'title' => 'Menu Item Removed',
            'description' => "{$name} has been removed from the menu.",
            'data' => [
                'entity_type' => 'menu_item',
                'entity_id' => null,
                'name' => $name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json(['message' => 'Menu item deleted successfully']);
    }
}
