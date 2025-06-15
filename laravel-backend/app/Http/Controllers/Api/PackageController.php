<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PackageController extends Controller
{
    public function index(): JsonResponse
    {
        $packages = Package::with(['destination', 'packageType'])->get();
        return response()->json($packages);
    }

    public function show($id): JsonResponse
    {
        $package = Package::with(['destination', 'packageType', 'inclusions', 'exclusions'])
            ->findOrFail($id);
        return response()->json($package);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_participants' => 'required|integer|min:1',
            'destination_id' => 'required|exists:destinations,id',
            'package_type_id' => 'required|exists:package_types,id',
        ]);

        $package = Package::create($validated);
        return response()->json($package, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'duration_days' => 'integer|min:1',
            'max_participants' => 'integer|min:1',
            'destination_id' => 'exists:destinations,id',
            'package_type_id' => 'exists:package_types,id',
        ]);

        $package->update($validated);
        return response()->json($package);
    }

    public function destroy($id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $package->delete();
        return response()->json(['message' => 'Package deleted successfully']);
    }
}