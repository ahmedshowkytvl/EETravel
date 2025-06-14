<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Hotel extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'name',
        'description',
        'destination_id',
        'category_id',
        'star_rating',
        'address',
        'phone',
        'email',
        'website',
        'latitude',
        'longitude',
        'featured_image',
        'gallery',
        'amenities',
        'check_in_time',
        'check_out_time',
        'cancellation_policy',
        'is_active',
        'is_featured',
        'meta_title',
        'meta_description',
    ];

    public array $translatable = [
        'name', 
        'description', 
        'amenities', 
        'cancellation_policy',
        'meta_title',
        'meta_description'
    ];

    protected $casts = [
        'gallery' => 'array',
        'amenities' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'check_in_time' => 'datetime:H:i',
        'check_out_time' => 'datetime:H:i',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function category()
    {
        return $this->belongsTo(HotelCategory::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function packages()
    {
        return $this->belongsToMany(Package::class, 'package_hotels');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByStarRating($query, $rating)
    {
        return $query->where('star_rating', $rating);
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }
}