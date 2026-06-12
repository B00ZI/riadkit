<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Excursion;
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
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        $validated['riad_id'] = $request->user()->riad_id;
        $excursion = Excursion::create($validated);

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
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        $excursion->update($validated);

        return response()->json($excursion);
    }

    public function destroy(Request $request, Excursion $excursion)
    {
        if ($excursion->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $excursion->delete();

        return response()->json(['message' => 'Excursion deleted successfully']);
    }
}