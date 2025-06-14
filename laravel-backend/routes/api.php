<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Public content routes
Route::get('destinations', [DestinationController::class, 'index']);
Route::get('destinations/{id}', [DestinationController::class, 'show']);
Route::get('destinations/popular', [DestinationController::class, 'popular']);

Route::get('tours', [TourController::class, 'index']);
Route::get('tours/{id}', [TourController::class, 'show']);
Route::get('tours/featured', [TourController::class, 'featured']);
Route::get('tours/search', [TourController::class, 'search']);

Route::get('packages', [PackageController::class, 'index']);
Route::get('packages/{id}', [PackageController::class, 'show']);
Route::get('packages/featured', [PackageController::class, 'featured']);

Route::get('hotels', [HotelController::class, 'index']);
Route::get('hotels/{id}', [HotelController::class, 'show']);
Route::get('hotels/featured', [HotelController::class, 'featured']);

Route::get('reviews', [ReviewController::class, 'index']);
Route::get('reviews/tour/{tourId}', [ReviewController::class, 'tourReviews']);
Route::get('reviews/package/{packageId}', [ReviewController::class, 'packageReviews']);
Route::get('reviews/hotel/{hotelId}', [ReviewController::class, 'hotelReviews']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('password', [AuthController::class, 'changePassword']);
    });

    // User bookings
    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('{id}', [BookingController::class, 'show']);
        Route::put('{id}', [BookingController::class, 'update']);
        Route::post('{id}/cancel', [BookingController::class, 'cancel']);
    });

    // Reviews
    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('{id}', [ReviewController::class, 'update']);
        Route::delete('{id}', [ReviewController::class, 'destroy']);
    });

    // Payments
    Route::prefix('payments')->group(function () {
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('booking/{bookingId}', [PaymentController::class, 'bookingPayments']);
        Route::post('verify', [PaymentController::class, 'verify']);
    });

});

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    
    // Dashboard
    Route::get('dashboard/stats', [AdminController::class, 'dashboardStats']);
    Route::get('system/health', [AdminController::class, 'systemHealth']);
    
    // User management
    Route::get('users', [AdminController::class, 'users']);
    Route::put('users/{id}/status', [AdminController::class, 'updateUserStatus']);
    Route::put('users/{id}/role', [AdminController::class, 'updateUserRole']);
    
    // Booking management
    Route::get('bookings', [AdminController::class, 'bookings']);
    Route::put('bookings/{id}/status', [AdminController::class, 'updateBookingStatus']);
    Route::post('bookings/{id}/confirm', [AdminController::class, 'confirmBooking']);
    Route::post('bookings/{id}/cancel', [AdminController::class, 'cancelBooking']);
    
    // Content management
    Route::apiResource('destinations', DestinationController::class)->except(['index', 'show']);
    Route::apiResource('tours', TourController::class)->except(['index', 'show', 'featured', 'search']);
    Route::apiResource('packages', PackageController::class)->except(['index', 'show', 'featured']);
    Route::apiResource('hotels', HotelController::class)->except(['index', 'show', 'featured']);
    
    // Categories
    Route::apiResource('tour-categories', TourCategoryController::class);
    Route::apiResource('package-categories', PackageCategoryController::class);
    Route::apiResource('hotel-categories', HotelCategoryController::class);
    
    // Analytics & Reports
    Route::get('analytics/bookings', [AdminController::class, 'bookingAnalytics']);
    Route::get('analytics/revenue', [AdminController::class, 'revenueAnalytics']);
    Route::get('analytics/destinations', [AdminController::class, 'destinationAnalytics']);
    
    // Data export
    Route::post('export', [AdminController::class, 'exportData']);
    Route::get('downloads/{file}', [AdminController::class, 'downloadFile']);
    
    // Settings
    Route::get('settings', [AdminController::class, 'getSettings']);
    Route::put('settings', [AdminController::class, 'updateSettings']);
    
});

// Webhook routes (no auth required)
Route::prefix('webhooks')->group(function () {
    Route::post('payment/stripe', [PaymentController::class, 'stripeWebhook']);
    Route::post('payment/paypal', [PaymentController::class, 'paypalWebhook']);
});

// Fallback route
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found'
    ], 404);
});