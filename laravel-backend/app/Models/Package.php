<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Package extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'title',
        'description',
        'short_description',
        'destination_id',
        'category_id',
        'duration_days',
        'duration_nights',
        'price',
        'discount_price',
        'max_participants',
        'package_type',
        'featured_image',
        'gallery',
        'includes',
        'excludes',
        'itinerary',
        'is_active',
        'is_featured',
        'availability_start',
        'availability_end',
        'meta_title',
        'meta_description',
        'seo_keywords',
    ];

    public array $translatable = [
        'title', 
        'description', 
        'short_description', 
        'includes', 
        'excludes', 
        'itinerary',
        'meta_title',
        'meta_description'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'gallery' => 'array',
        'includes' => 'array',
        'excludes' => 'array',
        'itinerary' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'availability_start' => 'date',
        'availability_end' => 'date',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function category()
    {
        return $this->belongsTo(PackageCategory::class);
    }

    public function tours()
    {
        return $this->belongsToMany(Tour::class, 'package_tours');
    }

    public function hotels()
    {
        return $this->belongsToMany(Hotel::class, 'package_hotels');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getEffectivePriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }
}