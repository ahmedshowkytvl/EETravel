<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    /**
     * Display a listing of countries
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Country::query();
            
            // Filter by active status if provided
            if ($request->has('active')) {
                $active = $request->boolean('active');
                $query->where('active', $active);
            }
            
            $countries = $query->orderBy('name')->get();
            
            return response()->json([
                'data' => $countries,
                'meta' => [
                    'total' => $countries->count(),
                    'timestamp' => now()->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch countries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified country
     */
    public function show(string $id): JsonResponse
    {
        try {
            $country = Country::with(['cities', 'destinations'])->findOrFail($id);
            
            return response()->json([
                'data' => $country
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Country not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch country',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get country by code
     */
    public function getByCode(string $code): JsonResponse
    {
        try {
            $country = Country::where('code', strtoupper($code))->firstOrFail();
            
            return response()->json([
                'data' => $country
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Country not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch country',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cities for a specific country
     */
    public function cities(string $id): JsonResponse
    {
        try {
            $country = Country::findOrFail($id);
            $cities = $country->cities()->where('active', true)->orderBy('name')->get();
            
            return response()->json([
                'data' => $cities,
                'meta' => [
                    'country' => $country->name,
                    'total' => $cities->count()
                ]
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Country not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch cities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created country
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|size:2|unique:countries,code',
                'currency' => 'required|string|size:3',
                'active' => 'boolean'
            ]);

            $country = Country::create($validated);

            return response()->json([
                'data' => $country,
                'message' => 'Country created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create country',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified country
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $country = Country::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|size:2|unique:countries,code,' . $id,
                'currency' => 'sometimes|required|string|size:3',
                'active' => 'sometimes|boolean'
            ]);

            $country->update($validated);

            return response()->json([
                'data' => $country->fresh(),
                'message' => 'Country updated successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Country not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update country',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified country
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $country = Country::findOrFail($id);
            $country->delete();

            return response()->json([
                'message' => 'Country deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Country not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete country',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}