<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Destination;
use App\Models\TourCategory;
use App\Models\PackageCategory;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create roles and permissions
        $this->createRolesAndPermissions();
        
        // Create admin user
        $this->createAdminUser();
        
        // Create sample destinations
        $this->createDestinations();
        
        // Create categories
        $this->createCategories();
        
        // Create sample user
        $this->createSampleUser();
    }

    private function createRolesAndPermissions()
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Create permissions
        $permissions = [
            'manage_users',
            'manage_bookings',
            'manage_tours',
            'manage_packages',
            'manage_hotels',
            'manage_destinations',
            'view_analytics',
            'export_data',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign all permissions to admin
        $adminRole->givePermissionTo($permissions);
    }

    private function createAdminUser()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@saharajourneys.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567890',
            'country' => 'Egypt',
            'city' => 'Cairo',
            'language_preference' => 'en',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $admin->assignRole('admin');
    }

    private function createSampleUser()
    {
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+1987654321',
            'country' => 'United States',
            'city' => 'New York',
            'language_preference' => 'en',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $user->assignRole('user');
    }

    private function createDestinations()
    {
        $destinations = [
            [
                'name' => [
                    'en' => 'Cairo',
                    'ar' => 'القاهرة'
                ],
                'description' => [
                    'en' => 'Explore the ancient wonders of Cairo, home to the Great Pyramids of Giza and the Sphinx.',
                    'ar' => 'استكشف عجائب القاهرة القديمة، موطن أهرامات الجيزة العظيمة وأبو الهول.'
                ],
                'country' => 'Egypt',
                'city' => 'Cairo',
                'latitude' => 30.0444,
                'longitude' => 31.2357,
                'is_active' => true,
            ],
            [
                'name' => [
                    'en' => 'Dubai',
                    'ar' => 'دبي'
                ],
                'description' => [
                    'en' => 'Experience the modern marvels of Dubai, from towering skyscrapers to luxurious shopping.',
                    'ar' => 'اختبر عجائب دبي الحديثة، من ناطحات السحاب الشاهقة إلى التسوق الفاخر.'
                ],
                'country' => 'UAE',
                'city' => 'Dubai',
                'latitude' => 25.2048,
                'longitude' => 55.2708,
                'is_active' => true,
            ],
            [
                'name' => [
                    'en' => 'Marrakech',
                    'ar' => 'مراكش'
                ],
                'description' => [
                    'en' => 'Discover the enchanting city of Marrakech with its vibrant souks and historic palaces.',
                    'ar' => 'اكتشف مدينة مراكش الساحرة بأسواقها النابضة بالحياة وقصورها التاريخية.'
                ],
                'country' => 'Morocco',
                'city' => 'Marrakech',
                'latitude' => 31.6295,
                'longitude' => -7.9811,
                'is_active' => true,
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }

    private function createCategories()
    {
        // Tour Categories
        $tourCategories = [
            [
                'name' => [
                    'en' => 'Cultural Tours',
                    'ar' => 'جولات ثقافية'
                ],
                'description' => [
                    'en' => 'Explore the rich cultural heritage of the Middle East',
                    'ar' => 'استكشف التراث الثقافي الغني للشرق الأوسط'
                ],
                'slug' => 'cultural-tours',
                'icon' => 'museum',
                'is_active' => true,
            ],
            [
                'name' => [
                    'en' => 'Adventure Tours',
                    'ar' => 'جولات مغامرة'
                ],
                'description' => [
                    'en' => 'Thrilling adventures in desert landscapes and mountains',
                    'ar' => 'مغامرات مثيرة في المناظر الطبيعية الصحراوية والجبال'
                ],
                'slug' => 'adventure-tours',
                'icon' => 'mountain',
                'is_active' => true,
            ],
            [
                'name' => [
                    'en' => 'Luxury Tours',
                    'ar' => 'جولات فاخرة'
                ],
                'description' => [
                    'en' => 'Premium travel experiences with luxury accommodations',
                    'ar' => 'تجارب سفر مميزة مع إقامة فاخرة'
                ],
                'slug' => 'luxury-tours',
                'icon' => 'star',
                'is_active' => true,
            ],
        ];

        foreach ($tourCategories as $category) {
            TourCategory::create($category);
        }

        // Package Categories
        $packageCategories = [
            [
                'name' => [
                    'en' => 'Honeymoon Packages',
                    'ar' => 'باقات شهر العسل'
                ],
                'description' => [
                    'en' => 'Romantic getaways for couples',
                    'ar' => 'إجازات رومانسية للأزواج'
                ],
                'slug' => 'honeymoon-packages',
                'icon' => 'heart',
                'is_active' => true,
            ],
            [
                'name' => [
                    'en' => 'Family Packages',
                    'ar' => 'باقات عائلية'
                ],
                'description' => [
                    'en' => 'Perfect vacations for families with children',
                    'ar' => 'إجازات مثالية للعائلات التي لديها أطفال'
                ],
                'slug' => 'family-packages',
                'icon' => 'users',
                'is_active' => true,
            ],
            [
                'name' => [
                    'en' => 'Business Travel',
                    'ar' => 'سفر الأعمال'
                ],
                'description' => [
                    'en' => 'Corporate travel solutions and business packages',
                    'ar' => 'حلول السفر للشركات وباقات الأعمال'
                ],
                'slug' => 'business-travel',
                'icon' => 'briefcase',
                'is_active' => true,
            ],
        ];

        foreach ($packageCategories as $category) {
            PackageCategory::create($category);
        }
    }
}