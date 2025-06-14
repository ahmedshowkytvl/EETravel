<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // Translatable field
            $table->json('description'); // Translatable field
            $table->string('country', 100);
            $table->string('city', 100);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('meta_title')->nullable(); // Translatable SEO
            $table->json('meta_description')->nullable(); // Translatable SEO
            $table->string('seo_keywords')->nullable();
            $table->timestamps();
            
            $table->index(['country', 'city']);
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('destinations');
    }
};