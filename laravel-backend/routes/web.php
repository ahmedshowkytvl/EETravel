<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to Sahara Journeys API',
        'version' => '1.0.0',
        'status' => 'active',
        'endpoints' => [
            'API Documentation' => '/api/docs',
            'Health Check' => '/api/health',
            'Authentication' => '/api/auth/*',
            'Destinations' => '/api/destinations',
            'Tours' => '/api/tours',
            'Packages' => '/api/packages',
            'Bookings' => '/api/bookings',
        ]
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'database' => 'connected',
        'environment' => app()->environment(),
    ]);
});