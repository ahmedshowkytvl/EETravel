<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DestinationController extends Controller
{
    public function index(): JsonResponse
    {
        $destinations = Destination::with(['country', 'tours', 'packages'])->get();
        return response()->json($destinations);
    }

    public function show($id): JsonResponse
    {
        $destination = Destination::with(['country', 'tours', 'packages', 'hotels'])
            ->findOrFail($id);
        return response()->json($destination);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'country_id' => 'required|exists:countries,id',
            'image_url' => 'nullable|string|url',
            'is_featured' => 'boolean',
        ]);

        $destination = Destination::create($validated);
        return response()->json($destination, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'country_id' => 'exists:countries,id',
            'image_url' => 'nullable|string|url',
            'is_featured' => 'boolean',
        ]);

        $destination->update($validated);
        return response()->json($destination);
    }

    public function destroy($id): JsonResponse
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();
        return response()->json(['message' => 'Destination deleted successfully']);
    }
}