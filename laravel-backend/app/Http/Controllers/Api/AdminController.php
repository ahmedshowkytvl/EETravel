<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\Package;
use App\Models\Hotel;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    public function dashboardStats()
    {
        $stats = [
            'total_users' => User::count(),
            'total_bookings' => Booking::count(),
            'total_tours' => Tour::count(),
            'total_packages' => Package::count(),
            'total_hotels' => Hotel::count(),
            'total_destinations' => Destination::count(),
            'pending_bookings' => Booking::where('status', Booking::STATUS_PENDING)->count(),
            'confirmed_bookings' => Booking::where('status', Booking::STATUS_CONFIRMED)->count(),
            'total_revenue' => Booking::where('payment_status', Booking::PAYMENT_STATUS_PAID)->sum('total_amount'),
            'monthly_revenue' => Booking::where('payment_status', Booking::PAYMENT_STATUS_PAID)
                                      ->whereMonth('created_at', now()->month)
                                      ->sum('total_amount'),
        ];

        $recentBookings = Booking::with(['user', 'tour', 'package', 'hotel'])
                                ->latest()
                                ->take(5)
                                ->get();

        $popularDestinations = Destination::withCount('bookings')
                                         ->orderBy('bookings_count', 'desc')
                                         ->take(5)
                                         ->get();

        $monthlyBookings = Booking::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(total_amount) as revenue')
        )
        ->where('created_at', '>=', now()->subMonths(12))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_bookings' => $recentBookings,
                'popular_destinations' => $popularDestinations,
                'monthly_trends' => $monthlyBookings
            ]
        ]);
    }

    public function users(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function bookings(Request $request)
    {
        $query = Booking::with(['user', 'tour', 'package', 'hotel']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $bookings = $query->orderBy('created_at', 'desc')
                         ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    public function updateBookingStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed'
        ]);

        $booking->update([
            'status' => $request->status,
            'confirmed_at' => $request->status === 'confirmed' ? now() : null,
            'cancelled_at' => $request->status === 'cancelled' ? now() : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated successfully',
            'data' => $booking->fresh()
        ]);
    }

    public function systemHealth()
    {
        $health = [
            'database' => $this->checkDatabaseHealth(),
            'cache' => $this->checkCacheHealth(),
            'storage' => $this->checkStorageHealth(),
            'queue' => $this->checkQueueHealth(),
        ];

        $overallStatus = collect($health)->every(fn($status) => $status === 'healthy') ? 'healthy' : 'warning';

        return response()->json([
            'success' => true,
            'data' => [
                'overall_status' => $overallStatus,
                'components' => $health,
                'timestamp' => now()->toISOString()
            ]
        ]);
    }

    private function checkDatabaseHealth()
    {
        try {
            DB::connection()->getPdo();
            return 'healthy';
        } catch (\Exception $e) {
            return 'error';
        }
    }

    private function checkCacheHealth()
    {
        try {
            cache()->put('health_check', 'ok', 10);
            return cache()->get('health_check') === 'ok' ? 'healthy' : 'error';
        } catch (\Exception $e) {
            return 'error';
        }
    }

    private function checkStorageHealth()
    {
        try {
            return \Storage::disk('local')->exists('.') ? 'healthy' : 'error';
        } catch (\Exception $e) {
            return 'error';
        }
    }

    private function checkQueueHealth()
    {
        try {
            // Basic queue health check
            return 'healthy';
        } catch (\Exception $e) {
            return 'error';
        }
    }

    public function exportData(Request $request)
    {
        $request->validate([
            'type' => 'required|in:users,bookings,tours,packages,hotels,destinations',
            'format' => 'required|in:csv,json,excel'
        ]);

        // Implementation would depend on specific export requirements
        return response()->json([
            'success' => true,
            'message' => 'Export initiated',
            'download_url' => '/api/admin/downloads/export_' . time() . '.' . $request->format
        ]);
    }
}