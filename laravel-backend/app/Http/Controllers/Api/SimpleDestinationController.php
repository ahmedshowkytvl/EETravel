<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SimpleDestinationController extends Controller
{
    public function index()
    {
        try {
            $destinations = DB::select("
                SELECT 
                    d.id,
                    d.name,
                    d.description,
                    d.country_id,
                    d.is_featured,
                    d.created_at,
                    d.updated_at,
                    c.name as country_name,
                    c.code as country_code,
                    c.currency as country_currency
                FROM destinations d
                LEFT JOIN countries c ON d.country_id = c.id
                ORDER BY d.is_featured DESC, d.name ASC
            ");

            $formatted = array_map(function($dest) {
                return [
                    'id' => $dest->id,
                    'name' => $dest->name,
                    'description' => $dest->description,
                    'country_id' => $dest->country_id,
                    'is_featured' => $dest->is_featured,
                    'created_at' => $dest->created_at,
                    'updated_at' => $dest->updated_at,
                    'country' => [
                        'id' => $dest->country_id,
                        'name' => $dest->country_name,
                        'code' => $dest->country_code,
                        'currency' => $dest->country_currency
                    ]
                ];
            }, $destinations);

            return response()->json($formatted);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $destination = DB::select("
                SELECT 
                    d.id,
                    d.name,
                    d.description,
                    d.country_id,
                    d.is_featured,
                    d.created_at,
                    d.updated_at,
                    c.name as country_name,
                    c.code as country_code,
                    c.currency as country_currency
                FROM destinations d
                LEFT JOIN countries c ON d.country_id = c.id
                WHERE d.id = ?
            ", [$id]);

            if (empty($destination)) {
                return response()->json(['error' => 'Destination not found'], 404);
            }

            $dest = $destination[0];
            $formatted = [
                'id' => $dest->id,
                'name' => $dest->name,
                'description' => $dest->description,
                'country_id' => $dest->country_id,
                'is_featured' => $dest->is_featured,
                'created_at' => $dest->created_at,
                'updated_at' => $dest->updated_at,
                'country' => [
                    'id' => $dest->country_id,
                    'name' => $dest->country_name,
                    'code' => $dest->country_code,
                    'currency' => $dest->country_currency
                ]
            ];

            return response()->json($formatted);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
        }
    }
}