<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Allow if user has any of the given roles
        if (in_array($request->user()->role, $roles)) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden – insufficient permissions'], 403);
    }
}