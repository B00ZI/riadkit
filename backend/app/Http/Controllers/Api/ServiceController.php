<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        $service->update($validated);

        return response()->json($service);
    }

    public function destroy(Request $request, Service $service)
    {
        if ($service->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }
}