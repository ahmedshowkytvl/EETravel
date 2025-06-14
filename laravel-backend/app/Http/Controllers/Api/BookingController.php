<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\Package;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->bookings()->with(['tour', 'package', 'hotel']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->orderBy('created_at', 'desc')
                         ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    public function show($id)
    {
        $booking = $request->user()->bookings()
                          ->with(['tour.destination', 'package.destination', 'hotel.destination', 'payments'])
                          ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:tour,package,hotel',
            'item_id' => 'required|integer',
            'travel_date' => 'required|date|after:today',
            'return_date' => 'nullable|date|after:travel_date',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'infants' => 'nullable|integer|min:0',
            'special_requests' => 'nullable|string|max:1000',
            'customer_details' => 'required|array',
            'customer_details.first_name' => 'required|string|max:100',
            'customer_details.last_name' => 'required|string|max:100',
            'customer_details.email' => 'required|email',
            'customer_details.phone' => 'required|string|max:20',
            'customer_details.nationality' => 'required|string|max:100',
            'emergency_contact' => 'required|array',
            'emergency_contact.name' => 'required|string|max:100',
            'emergency_contact.phone' => 'required|string|max:20',
            'emergency_contact.relationship' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $bookingData = [
                'user_id' => $request->user()->id,
                'booking_date' => now(),
                'travel_date' => $request->travel_date,
                'return_date' => $request->return_date,
                'adults' => $request->adults,
                'children' => $request->children ?? 0,
                'infants' => $request->infants ?? 0,
                'special_requests' => $request->special_requests,
                'customer_details' => $request->customer_details,
                'emergency_contact' => $request->emergency_contact,
                'status' => Booking::STATUS_PENDING,
                'payment_status' => Booking::PAYMENT_STATUS_PENDING,
            ];

            $totalAmount = 0;

            switch ($request->type) {
                case 'tour':
                    $tour = Tour::findOrFail($request->item_id);
                    $bookingData['tour_id'] = $tour->id;
                    $totalAmount = $tour->effective_price * ($request->adults + $request->children);
                    break;

                case 'package':
                    $package = Package::findOrFail($request->item_id);
                    $bookingData['package_id'] = $package->id;
                    $totalAmount = $package->effective_price * ($request->adults + $request->children);
                    break;

                case 'hotel':
                    $hotel = Hotel::findOrFail($request->item_id);
                    $bookingData['hotel_id'] = $hotel->id;
                    // Hotel pricing would need room selection logic
                    $totalAmount = 0; // Calculate based on room selection
                    break;
            }

            $bookingData['total_amount'] = $totalAmount;
            $bookingData['paid_amount'] = 0;

            $booking = Booking::create($bookingData);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => $booking->load(['tour', 'package', 'hotel'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Booking creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);

        if ($booking->status !== Booking::STATUS_PENDING) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot modify confirmed or cancelled booking'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'travel_date' => 'date|after:today',
            'return_date' => 'nullable|date|after:travel_date',
            'adults' => 'integer|min:1',
            'children' => 'nullable|integer|min:0',
            'infants' => 'nullable|integer|min:0',
            'special_requests' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking->update($request->only([
            'travel_date', 'return_date', 'adults', 'children', 
            'infants', 'special_requests'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Booking updated successfully',
            'data' => $booking->fresh()
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json([
                'success' => false,
                'message' => 'Booking is already cancelled'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'required|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking->update([
            'status' => Booking::STATUS_CANCELLED,
            'cancellation_reason' => $request->cancellation_reason,
            'cancelled_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully',
            'data' => $booking->fresh()
        ]);
    }

    public function confirm(Request $request, $id)
    {
        // Admin only endpoint
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $booking = Booking::findOrFail($id);

        $booking->update([
            'status' => Booking::STATUS_CONFIRMED,
            'confirmed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking confirmed successfully',
            'data' => $booking->fresh()
        ]);
    }
}