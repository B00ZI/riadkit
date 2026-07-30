<?php

namespace App\Http\Controllers\Api;

use App\Events\NewNotification;
use App\Http\Controllers\Controller;
use App\Models\HouseRule;
use App\Models\Notification;
use Illuminate\Http\Request;

class HouseRuleController extends Controller
{
    public function index(Request $request)
    {
        $rules = HouseRule::where('riad_id', $request->user()->riad_id)
            ->orderBy('sort_order')
            ->get();

        return response()->json($rules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'value' => 'required|string|max:255',
            'icon' => 'required|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['riad_id'] = $request->user()->riad_id;
        $rule = HouseRule::create($validated);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'house_rule_created',
            'title' => 'New House Rule',
            'description' => "{$rule->title} has been added.",
            'data' => [
                'entity_type' => 'house_rule',
                'entity_id' => $rule->id,
                'name' => $rule->title,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($rule, 201);
    }

    public function show(Request $request, HouseRule $houseRule)
    {
        if ($houseRule->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($houseRule);
    }

    public function update(Request $request, HouseRule $houseRule)
    {
        if ($houseRule->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'value' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $houseRule->update($validated);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'house_rule_updated',
            'title' => 'House Rule Updated',
            'description' => "{$houseRule->title} has been updated.",
            'data' => [
                'entity_type' => 'house_rule',
                'entity_id' => $houseRule->id,
                'name' => $houseRule->title,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json($houseRule);
    }

    public function destroy(Request $request, HouseRule $houseRule)
    {
        if ($houseRule->riad_id !== $request->user()->riad_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $title = $houseRule->title;
        $houseRule->delete();

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'house_rule_deleted',
            'title' => 'House Rule Removed',
            'description' => "{$title} has been removed.",
            'data' => [
                'entity_type' => 'house_rule',
                'entity_id' => null,
                'name' => $title,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json(['message' => 'House rule deleted successfully']);
    }
}
