<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TourController extends Controller
{
    public function index(Request $request)
    {
        $query = Tour::with(['destination', 'category', 'reviews']);

        if ($request->has('destination_id')) {
            $query->where('destination_id', $request->destination_id);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('difficulty_level')) {
            $query->where('difficulty_level', $request->difficulty_level);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('available')) {
            $query->available();
        }

        $query->active();

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $tours = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $tours
        ]);
    }

    public function show($id)
    {
        $tour = Tour::with([
            'destination',
            'category',
            'reviews' => function ($query) {
                $query->with('user')->latest();
            },
            'bookings' => function ($query) {
                $query->confirmed();
            }
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $tour
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|array',
            'title.en' => 'required|string|max:255',
            'title.ar' => 'nullable|string|max:255',
            'description' => 'required|array',
            'description.en' => 'required|string',
            'description.ar' => 'nullable|string',
            'destination_id' => 'required|exists:destinations,id',
            'category_id' => 'required|exists:tour_categories,id',
            'duration_days' => 'required|integer|min:1',
            'duration_nights' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'max_participants' => 'required|integer|min:1',
            'min_participants' => 'required|integer|min:1|lte:max_participants',
            'difficulty_level' => 'required|in:easy,moderate,challenging,extreme',
            'featured_image' => 'nullable|url',
            'gallery' => 'nullable|array',
            'gallery.*' => 'url',
            'itinerary' => 'nullable|array',
            'includes' => 'nullable|array',
            'excludes' => 'nullable|array',
            'requirements' => 'nullable|array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'availability_start' => 'nullable|date',
            'availability_end' => 'nullable|date|after:availability_start',
            'booking_deadline' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $tour = Tour::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tour created successfully',
            'data' => $tour->load(['destination', 'category'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'array',
            'title.en' => 'string|max:255',
            'title.ar' => 'nullable|string|max:255',
            'description' => 'array',
            'description.en' => 'string',
            'description.ar' => 'nullable|string',
            'destination_id' => 'exists:destinations,id',
            'category_id' => 'exists:tour_categories,id',
            'duration_days' => 'integer|min:1',
            'duration_nights' => 'integer|min:0',
            'price' => 'numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'max_participants' => 'integer|min:1',
            'min_participants' => 'integer|min:1',
            'difficulty_level' => 'in:easy,moderate,challenging,extreme',
            'featured_image' => 'nullable|url',
            'gallery' => 'nullable|array',
            'gallery.*' => 'url',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'availability_start' => 'nullable|date',
            'availability_end' => 'nullable|date|after:availability_start',
            'booking_deadline' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $tour->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tour updated successfully',
            'data' => $tour->fresh(['destination', 'category'])
        ]);
    }

    public function destroy($id)
    {
        $tour = Tour::findOrFail($id);
        
        if ($tour->bookings()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete tour with existing bookings'
            ], 400);
        }

        $tour->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tour deleted successfully'
        ]);
    }

    public function featured()
    {
        $tours = Tour::with(['destination', 'category'])
            ->featured()
            ->active()
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tours
        ]);
    }

    public function search(Request $request)
    {
        $query = Tour::with(['destination', 'category']);

        if ($request->has('q')) {
            $searchTerm = $request->q;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereJsonContains('title->en', $searchTerm)
                  ->orWhereJsonContains('title->ar', $searchTerm)
                  ->orWhereJsonContains('description->en', $searchTerm)
                  ->orWhereJsonContains('description->ar', $searchTerm);
            });
        }

        $tours = $query->active()->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $tours
        ]);
    }
}