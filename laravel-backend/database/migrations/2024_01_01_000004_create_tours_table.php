<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->json('title'); // Translatable field
            $table->json('description'); // Translatable field
            $table->json('short_description')->nullable(); // Translatable field
            $table->foreignId('destination_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('tour_categories')->onDelete('cascade');
            $table->integer('duration_days');
            $table->integer('duration_nights');
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('max_participants');
            $table->integer('min_participants')->default(1);
            $table->enum('difficulty_level', ['easy', 'moderate', 'challenging', 'extreme']);
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('itinerary')->nullable(); // Translatable field
            $table->json('includes')->nullable(); // Translatable field
            $table->json('excludes')->nullable(); // Translatable field
            $table->json('requirements')->nullable(); // Translatable field
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->date('availability_start')->nullable();
            $table->date('availability_end')->nullable();
            $table->date('booking_deadline')->nullable();
            $table->json('meta_title')->nullable(); // Translatable SEO
            $table->json('meta_description')->nullable(); // Translatable SEO
            $table->string('seo_keywords')->nullable();
            $table->timestamps();
            
            $table->index(['destination_id', 'is_active']);
            $table->index(['category_id', 'is_active']);
            $table->index('is_featured');
            $table->index('difficulty_level');
            $table->index(['price', 'discount_price']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('tours');
    }
};