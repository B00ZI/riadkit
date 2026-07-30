<?php

namespace App\Http\Controllers\Api;

use App\Events\NewNotification;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class StaffController extends Controller
{
    /**
     * List all staff members for the owner's riad.
     */
    public function index(Request $request)
    {
        $staff = User::where('riad_id', $request->user()->riad_id)
            ->where('role', 'receptionist')
            ->select('id', 'name', 'email', 'riad_id', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($staff);
    }

    /**
     * Create a new receptionist.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'riad_id' => $request->user()->riad_id,
            'role' => 'receptionist',
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'staff_created',
            'title' => 'New Staff Member Added',
            'description' => "{$validated['name']} has been added as staff.",
            'data' => [
                'entity_type' => 'staff',
                'entity_id' => $user->id,
                'name' => $validated['name'],
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Staff member created successfully',
            'user' => $user->only('id', 'name', 'email', 'role'),
        ], 201);
    }

    /**
     * Update a staff member.
     */
    public function update(Request $request, $id)
    {
        // Ensure the staff member belongs to the owner's riad
        $staff = User::where('riad_id', $request->user()->riad_id)
            ->where('id', $id)
            ->where('role', 'receptionist')
            ->firstOrFail();

        $rules = [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
        ];

        // Only validate password if it's provided
        if ($request->has('password') && !empty($request->password)) {
            $rules['password'] = 'string|min:8|confirmed';
        }

        $validated = $request->validate($rules);

        // Update fields
        if (isset($validated['name'])) {
            $staff->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $staff->email = $validated['email'];
        }
        if (isset($validated['password']) && !empty($validated['password'])) {
            $staff->password = Hash::make($validated['password']);
        }

        $staff->save();

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'staff_updated',
            'title' => 'Staff Member Updated',
            'description' => "{$staff->name}'s details have been updated.",
            'data' => [
                'entity_type' => 'staff',
                'entity_id' => $staff->id,
                'name' => $staff->name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Staff member updated successfully',
            'user' => $staff->only('id', 'name', 'email', 'role'),
        ]);
    }

    /**
     * Delete a staff member.
     */
    public function destroy(Request $request, $id)
    {
        // Ensure the staff member belongs to the owner's riad
        $staff = User::where('riad_id', $request->user()->riad_id)
            ->where('id', $id)
            ->where('role', 'receptionist')
            ->firstOrFail();

        // Prevent deleting yourself
        if ($staff->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.'
            ], 403);
        }

        $name = $staff->name;
        $staff->delete(); // or $staff->forceDelete() if no soft deletes

        // Notification
        $notification = Notification::create([
            'riad_id' => $request->user()->riad_id,
            'type' => 'staff_deleted',
            'title' => 'Staff Member Removed',
            'description' => "{$name} has been removed from staff.",
            'data' => [
                'entity_type' => 'staff',
                'entity_id' => null,
                'name' => $name,
            ],
        ]);
        NewNotification::dispatch($notification);

        return response()->json([
            'message' => 'Staff member deleted successfully'
        ]);
    }

    /**
     * Get a single staff member (optional – for editing prefills).
     */
    public function show(Request $request, $id)
    {
        $staff = User::where('riad_id', $request->user()->riad_id)
            ->where('id', $id)
            ->where('role', 'receptionist')
            ->firstOrFail();

        return response()->json($staff->only('id', 'name', 'email'));
    }
}