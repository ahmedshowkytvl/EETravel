<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Create users table with authentication
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('username')->unique();
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('first_name')->nullable();
                $table->string('last_name')->nullable();
                $table->string('phone')->nullable();
                $table->enum('role', ['user', 'admin'])->default('user');
                $table->boolean('active')->default(true);
                $table->rememberToken();
                $table->timestamps();
            });
        }

        // Create countries table (if not exists)
        if (!Schema::hasTable('countries')) {
            Schema::create('countries', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('code', 2)->unique();
                $table->string('currency', 3);
                $table->boolean('active')->default(true);
                $table->timestamps();
            });
        } else {
            // Add active column if missing
            if (!Schema::hasColumn('countries', 'active')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->boolean('active')->default(true);
                });
            }
        }

        // Create cities table
        if (!Schema::hasTable('cities')) {
            Schema::create('cities', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->unsignedBigInteger('country_id');
                $table->boolean('active')->default(true);
                $table->timestamps();
                
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
            });
        }

        // Create destinations table
        if (!Schema::hasTable('destinations')) {
            Schema::create('destinations', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description');
                $table->unsignedBigInteger('country_id');
                $table->boolean('is_featured')->default(false);
                $table->string('image_url')->nullable();
                $table->json('gallery')->nullable();
                $table->boolean('active')->default(true);
                $table->timestamps();
                
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
            });
        }

        // Create tour categories table
        if (!Schema::hasTable('tour_categories')) {
            Schema::create('tour_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->boolean('active')->default(true);
                $table->timestamps();
            });
        }

        // Create tours table
        if (!Schema::hasTable('tours')) {
            Schema::create('tours', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description');
                $table->unsignedBigInteger('destination_id');
                $table->unsignedBigInteger('category_id')->nullable();
                $table->decimal('price', 10, 2);
                $table->integer('duration_days');
                $table->integer('max_participants')->default(20);
                $table->boolean('is_featured')->default(false);
                $table->string('image_url')->nullable();
                $table->json('gallery')->nullable();
                $table->json('itinerary')->nullable();
                $table->boolean('active')->default(true);
                $table->timestamps();
                
                $table->foreign('destination_id')->references('id')->on('destinations')->onDelete('cascade');
                $table->foreign('category_id')->references('id')->on('tour_categories')->onDelete('set null');
            });
        }

        // Create package categories table
        if (!Schema::hasTable('package_categories')) {
            Schema::create('package_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->boolean('active')->default(true);
                $table->timestamps();
            });
        }

        // Create packages table
        if (!Schema::hasTable('packages')) {
            Schema::create('packages', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description');
                $table->unsignedBigInteger('category_id')->nullable();
                $table->decimal('price', 10, 2);
                $table->integer('duration_days');
                $table->boolean('is_featured')->default(false);
                $table->string('image_url')->nullable();
                $table->json('destinations')->nullable();
                $table->json('inclusions')->nullable();
                $table->json('exclusions')->nullable();
                $table->boolean('active')->default(true);
                $table->timestamps();
                
                $table->foreign('category_id')->references('id')->on('package_categories')->onDelete('set null');
            });
        }

        // Create hotels table
        if (!Schema::hasTable('hotels')) {
            Schema::create('hotels', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description');
                $table->unsignedBigInteger('destination_id');
                $table->integer('rating')->default(4);
                $table->decimal('price_per_night', 8, 2);
                $table->string('address');
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->json('amenities')->nullable();
                $table->string('image_url')->nullable();
                $table->json('gallery')->nullable();
                $table->boolean('active')->default(true);
                $table->timestamps();
                
                $table->foreign('destination_id')->references('id')->on('destinations')->onDelete('cascade');
            });
        }

        // Create bookings table
        if (!Schema::hasTable('bookings')) {
            Schema::create('bookings', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('booking_type'); // 'tour', 'package', 'hotel'
                $table->unsignedBigInteger('bookable_id');
                $table->string('bookable_type');
                $table->date('start_date');
                $table->date('end_date')->nullable();
                $table->integer('participants');
                $table->decimal('total_price', 10, 2);
                $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
                $table->json('customer_details');
                $table->timestamps();
                
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->index(['bookable_id', 'bookable_type']);
            });
        }

        // Create reviews table
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('reviewable_type');
                $table->unsignedBigInteger('reviewable_id');
                $table->integer('rating')->min(1)->max(5);
                $table->text('comment')->nullable();
                $table->boolean('is_verified')->default(false);
                $table->boolean('active')->default(true);
                $table->timestamps();
                
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->index(['reviewable_id', 'reviewable_type']);
            });
        }

        // Create payments table
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('booking_id');
                $table->decimal('amount', 10, 2);
                $table->string('currency', 3)->default('USD');
                $table->string('payment_method'); // 'stripe', 'paypal', etc.
                $table->string('transaction_id')->nullable();
                $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
                $table->json('payment_data')->nullable();
                $table->timestamps();
                
                $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            });
        }

        // Create personal access tokens table for API authentication
        if (!Schema::hasTable('personal_access_tokens')) {
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->morphs('tokenable');
                $table->string('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('hotels');
        Schema::dropIfExists('packages');
        Schema::dropIfExists('package_categories');
        Schema::dropIfExists('tours');
        Schema::dropIfExists('tour_categories');
        Schema::dropIfExists('destinations');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('users');
    }
};