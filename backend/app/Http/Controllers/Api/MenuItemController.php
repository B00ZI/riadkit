<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
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
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        // Validate that the chosen category belongs to the same Riad
        $category = $request->user()->riad->categories()->find($validated['category_id']);
        if (! $category) {
            return response()->json(['message' => 'Invalid category selected'], 422);
        }

        $validated['riad_id'] = $request->user()->riad_id;
        $menuItem = MenuItem::create($validated);

        return response()->json($menuItem, 201);
    }

    public function update(Request $request, MenuItem $menuItem)
    {

        \Log::debug('Menu item update check', [
            'auth_user_id' => $request->user()->id,
            'auth_user_riad' => $request->user()->riad_id,
            'menu_item_id' => $menuItem->id,
            'menu_item_riad' => $menuItem->riad_id,
            'compare' => $menuItem->riad_id !== $request->user()->riad_id,
        ]);
        if ($menuItem->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        if (isset($validated['category_id'])) {
            $category = $request->user()->riad->categories()->find($validated['category_id']);
            if (! $category) {
                return response()->json(['message' => 'Invalid category selected'], 422);
            }
        }

        $menuItem->update($validated);

        return response()->json($menuItem);
    }

    public function destroy(Request $request, MenuItem $menuItem)
    {
        if ($menuItem->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $menuItem->delete();

        return response()->json(['message' => 'Menu item deleted successfully']);
    }
}
