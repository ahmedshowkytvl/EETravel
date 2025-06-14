<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'tour', 'package', 'hotel'])->verified();

        if ($request->has('rating')) {
            $query->byRating($request->rating);
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        $reviews = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function tourReviews($tourId)
    {
        $reviews = Review::with(['user'])
                        ->where('tour_id', $tourId)
                        ->verified()
                        ->latest()
                        ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function packageReviews($packageId)
    {
        $reviews = Review::with(['user'])
                        ->where('package_id', $packageId)
                        ->verified()
                        ->latest()
                        ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function hotelReviews($hotelId)
    {
        $reviews = Review::with(['user'])
                        ->where('hotel_id', $hotelId)
                        ->verified()
                        ->latest()
                        ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = Booking::where('id', $request->booking_id)
                         ->where('user_id', $request->user()->id)
                         ->where('status', 'completed')
                         ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'You can only review completed bookings'
            ], 400);
        }

        // Check if review already exists
        $existingReview = Review::where('booking_id', $booking->id)->first();
        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this booking'
            ], 400);
        }

        $reviewData = [
            'user_id' => $request->user()->id,
            'booking_id' => $booking->id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'photos' => $request->photos,
            'is_verified' => false,
        ];

        // Assign to the appropriate entity
        if ($booking->tour_id) {
            $reviewData['tour_id'] = $booking->tour_id;
        } elseif ($booking->package_id) {
            $reviewData['package_id'] = $booking->package_id;
        } elseif ($booking->hotel_id) {
            $reviewData['hotel_id'] = $booking->hotel_id;
        }

        $review = Review::create($reviewData);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully',
            'data' => $review
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::where('id', $id)
                       ->where('user_id', $request->user()->id)
                       ->first();

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found or unauthorized'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $review->update($request->only(['rating', 'title', 'comment', 'photos']));

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review->fresh()
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $review = Review::where('id', $id)
                       ->where('user_id', $request->user()->id)
                       ->first();

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found or unauthorized'
            ], 404);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    }
}