<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\BookingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'Sahara Journeys API is running',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Countries API
Route::get('countries', [App\Http\Controllers\Api\CountryController::class, 'index']);
Route::get('countries/{id}', [App\Http\Controllers\Api\CountryController::class, 'show']);
Route::get('countries/code/{code}', [App\Http\Controllers\Api\CountryController::class, 'getByCode']);
Route::get('countries/{id}/cities', [App\Http\Controllers\Api\CountryController::class, 'cities']);

// Public content routes
Route::get('destinations', [App\Http\Controllers\Api\SimpleDestinationController::class, 'index']);
Route::get('destinations/{id}', [App\Http\Controllers\Api\SimpleDestinationController::class, 'show']);

Route::get('tours', [TourController::class, 'index']);
Route::get('tours/{id}', [TourController::class, 'show']);

Route::get('packages', [PackageController::class, 'index']);
Route::get('packages/{id}', [PackageController::class, 'show']);

Route::get('hotels', [HotelController::class, 'index']);
Route::get('hotels/{id}', [HotelController::class, 'show']);

// Menu routes
Route::get('menus', [\App\Http\Controllers\Api\MenuController::class, 'index']);
Route::get('menus/location/{location}', [\App\Http\Controllers\Api\MenuController::class, 'getByLocation']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });

    // User bookings
    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('{id}', [BookingController::class, 'show']);
        Route::put('{id}', [BookingController::class, 'update']);
    });

    // Admin content management
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('admin/destinations', DestinationController::class)->except(['index', 'show']);
        Route::apiResource('admin/tours', TourController::class)->except(['index', 'show']);
        Route::apiResource('admin/packages', PackageController::class)->except(['index', 'show']);
        Route::apiResource('admin/hotels', HotelController::class)->except(['index', 'show']);
    });

});

// Fallback route
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found'
    ], 404);
});