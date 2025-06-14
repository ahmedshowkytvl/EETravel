<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->json('description');
            $table->json('short_description')->nullable();
            $table->foreignId('destination_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('package_categories')->onDelete('cascade');
            $table->integer('duration_days');
            $table->integer('duration_nights');
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('max_participants');
            $table->enum('package_type', ['standard', 'luxury', 'premium', 'budget']);
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('includes')->nullable();
            $table->json('excludes')->nullable();
            $table->json('itinerary')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->date('availability_start')->nullable();
            $table->date('availability_end')->nullable();
            $table->json('meta_title')->nullable();
            $table->json('meta_description')->nullable();
            $table->string('seo_keywords')->nullable();
            $table->timestamps();
            
            $table->index(['destination_id', 'is_active']);
            $table->index(['category_id', 'is_active']);
            $table->index('is_featured');
            $table->index('package_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('packages');
    }
};