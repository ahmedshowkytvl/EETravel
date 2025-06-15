<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SimpleDestinationController extends Controller
{
    /**
     * Display a listing of destinations
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Destination::with('country')->where('active', true);
            
            // Filter by country if provided
            if ($request->has('country_id')) {
                $query->where('country_id', $request->country_id);
            }
            
            // Filter by featured status
            if ($request->has('featured')) {
                $query->where('featured', $request->boolean('featured'));
            }
            
            $destinations = $query->orderBy('name')->get();
            
            return response()->json([
                'data' => $destinations,
                'meta' => [
                    'total' => $destinations->count(),
                    'timestamp' => now()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch destinations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Display the specified destination
     */
    public function show(string $id): JsonResponse
    {
        try {
            $destination = Destination::with(['country', 'tours', 'packages', 'hotels'])
                ->where('active', true)
                ->findOrFail($id);
                
            return response()->json([
                'data' => $destination,
                'meta' => [
                    'timestamp' => now()
                ]
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Destination not found'
            ], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch destination',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}