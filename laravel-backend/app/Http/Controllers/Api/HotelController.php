<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HotelController extends Controller
{
    public function index(): JsonResponse
    {
        $hotels = Hotel::with(['destination'])->get();
        return response()->json($hotels);
    }

    public function show($id): JsonResponse
    {
        $hotel = Hotel::with(['destination', 'rooms'])
            ->findOrFail($id);
        return response()->json($hotel);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'address' => 'required|string',
            'star_rating' => 'required|integer|min:1|max:5',
            'destination_id' => 'required|exists:destinations,id',
            'amenities' => 'nullable|array',
        ]);

        $hotel = Hotel::create($validated);
        return response()->json($hotel, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $hotel = Hotel::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'address' => 'string',
            'star_rating' => 'integer|min:1|max:5',
            'destination_id' => 'exists:destinations,id',
            'amenities' => 'nullable|array',
        ]);

        $hotel->update($validated);
        return response()->json($hotel);
    }

    public function destroy($id): JsonResponse
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->delete();
        return response()->json(['message' => 'Hotel deleted successfully']);
    }
}