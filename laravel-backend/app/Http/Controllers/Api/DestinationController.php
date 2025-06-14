<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DestinationController extends Controller
{
    public function index(Request $request)
    {
        $query = Destination::with(['tours', 'packages', 'hotels']);

        if ($request->has('country')) {
            $query->byCountry($request->country);
        }

        if ($request->has('active')) {
            $query->active();
        }

        $destinations = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $destinations
        ]);
    }

    public function show($id)
    {
        $destination = Destination::with([
            'tours' => function ($query) {
                $query->active()->with(['category', 'reviews']);
            },
            'packages' => function ($query) {
                $query->active()->with(['category', 'reviews']);
            },
            'hotels' => function ($query) {
                $query->active()->with(['category', 'reviews']);
            }
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $destination
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.ar' => 'nullable|string|max:255',
            'description' => 'required|array',
            'description.en' => 'required|string',
            'description.ar' => 'nullable|string',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'featured_image' => 'nullable|url',
            'gallery' => 'nullable|array',
            'gallery.*' => 'url',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $destination = Destination::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Destination created successfully',
            'data' => $destination
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'array',
            'name.en' => 'string|max:255',
            'name.ar' => 'nullable|string|max:255',
            'description' => 'array',
            'description.en' => 'string',
            'description.ar' => 'nullable|string',
            'country' => 'string|max:100',
            'city' => 'string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'featured_image' => 'nullable|url',
            'gallery' => 'nullable|array',
            'gallery.*' => 'url',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $destination->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Destination updated successfully',
            'data' => $destination->fresh()
        ]);
    }

    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();

        return response()->json([
            'success' => true,
            'message' => 'Destination deleted successfully'
        ]);
    }

    public function popular()
    {
        $destinations = Destination::withCount(['tours', 'packages', 'hotels'])
            ->active()
            ->orderBy('tours_count', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $destinations
        ]);
    }
}