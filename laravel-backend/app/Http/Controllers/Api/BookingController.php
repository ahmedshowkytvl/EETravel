<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function index(): JsonResponse
    {
        $bookings = Booking::with(['user', 'tour', 'package'])->get();
        return response()->json($bookings);
    }

    public function show($id): JsonResponse
    {
        $booking = Booking::with(['user', 'tour', 'package', 'payments'])
            ->findOrFail($id);
        return response()->json($booking);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tour_id' => 'nullable|exists:tours,id',
            'package_id' => 'nullable|exists:packages,id',
            'booking_date' => 'required|date',
            'participants' => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $booking = Booking::create($validated);
        return response()->json($booking, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);
        
        $validated = $request->validate([
            'booking_date' => 'date',
            'participants' => 'integer|min:1',
            'total_amount' => 'numeric|min:0',
            'status' => 'in:pending,confirmed,cancelled',
        ]);

        $booking->update($validated);
        return response()->json($booking);
    }

    public function destroy($id): JsonResponse
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        return response()->json(['message' => 'Booking deleted successfully']);
    }
}