<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\Package;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    public function run()
    {
        // Create countries
        $egypt = Country::create([
            'name' => 'Egypt',
            'code' => 'EG',
            'currency' => 'EGP'
        ]);

        $jordan = Country::create([
            'name' => 'Jordan',
            'code' => 'JO',
            'currency' => 'JOD'
        ]);

        // Create destinations
        $cairo = Destination::create([
            'name' => 'Cairo',
            'description' => 'The capital of Egypt with ancient pyramids and rich history',
            'country_id' => $egypt->id,
            'is_featured' => true
        ]);

        $petra = Destination::create([
            'name' => 'Petra',
            'description' => 'Ancient archaeological site in Jordan',
            'country_id' => $jordan->id,
            'is_featured' => true
        ]);

        // Create tours
        Tour::create([
            'name' => 'Pyramids Tour',
            'description' => 'Visit the Great Pyramids of Giza',
            'price' => 150.00,
            'duration_hours' => 8,
            'max_participants' => 25,
            'destination_id' => $cairo->id
        ]);

        Tour::create([
            'name' => 'Petra Discovery',
            'description' => 'Explore the rose-red city of Petra',
            'price' => 200.00,
            'duration_hours' => 10,
            'max_participants' => 20,
            'destination_id' => $petra->id
        ]);

        // Create packages
        Package::create([
            'name' => 'Egypt Explorer',
            'description' => '7-day Egypt adventure package',
            'price' => 1200.00,
            'duration_days' => 7,
            'max_participants' => 15,
            'destination_id' => $cairo->id
        ]);

        // Create hotels
        Hotel::create([
            'name' => 'Cairo Grand Hotel',
            'description' => 'Luxury hotel in downtown Cairo',
            'address' => 'Tahrir Square, Cairo',
            'star_rating' => 5,
            'destination_id' => $cairo->id
        ]);

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@saharajourneys.com',
            'password' => Hash::make('password123'),
            'role' => 'admin'
        ]);
    }
}