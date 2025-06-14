<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Tour extends Model
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
        'min_participants',
        'difficulty_level',
        'featured_image',
        'gallery',
        'itinerary',
        'includes',
        'excludes',
        'requirements',
        'is_active',
        'is_featured',
        'availability_start',
        'availability_end',
        'booking_deadline',
        'meta_title',
        'meta_description',
        'seo_keywords',
    ];

    public array $translatable = [
        'title', 
        'description', 
        'short_description', 
        'itinerary', 
        'includes', 
        'excludes', 
        'requirements',
        'meta_title',
        'meta_description'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'gallery' => 'array',
        'itinerary' => 'array',
        'includes' => 'array',
        'excludes' => 'array',
        'requirements' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'availability_start' => 'date',
        'availability_end' => 'date',
        'booking_deadline' => 'date',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function category()
    {
        return $this->belongsTo(TourCategory::class);
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

    public function scopeAvailable($query)
    {
        return $query->where('availability_start', '<=', now())
                    ->where('availability_end', '>=', now());
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->discount_price && $this->price > 0) {
            return round((($this->price - $this->discount_price) / $this->price) * 100);
        }
        return 0;
    }

    public function getEffectivePriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }
}