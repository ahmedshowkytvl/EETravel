<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    /**
     * Get menu by location
     */
    public function getByLocation(string $location): JsonResponse
    {
        // For now, return static menu data for footer
        // This will be replaced with database queries once menu tables are created
        
        if ($location === 'footer') {
            $menuData = [
                'menu' => [
                    'id' => 1,
                    'name' => 'Footer Menu',
                    'location' => 'footer',
                    'description' => 'Main footer navigation',
                    'active' => true
                ],
                'items' => [
                    [
                        'id' => 1,
                        'title' => 'Home',
                        'url' => '/',
                        'order' => 0,
                        'active' => true,
                        'itemType' => 'link'
                    ],
                    [
                        'id' => 2,
                        'title' => 'Destinations',
                        'url' => '/destinations',
                        'order' => 1,
                        'active' => true,
                        'itemType' => 'link'
                    ],
                    [
                        'id' => 3,
                        'title' => 'Packages',
                        'url' => '/packages',
                        'order' => 2,
                        'active' => true,
                        'itemType' => 'link'
                    ],
                    [
                        'id' => 4,
                        'title' => 'About Us',
                        'url' => '/about',
                        'order' => 3,
                        'active' => true,
                        'itemType' => 'link'
                    ],
                    [
                        'id' => 5,
                        'title' => 'Contact',
                        'url' => '/contact',
                        'order' => 4,
                        'active' => true,
                        'itemType' => 'link'
                    ]
                ]
            ];
            
            return response()->json($menuData);
        }
        
        // Return empty menu for other locations
        return response()->json([
            'menu' => null,
            'items' => []
        ]);
    }
    
    /**
     * Get all menus
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [],
            'meta' => [
                'total' => 0,
                'timestamp' => now()->toISOString()
            ]
        ]);
    }
}