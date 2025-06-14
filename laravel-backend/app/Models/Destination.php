<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Destination extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'name',
        'description',
        'country',
        'city',
        'latitude',
        'longitude',
        'featured_image',
        'gallery',
        'is_active',
        'meta_title',
        'meta_description',
        'seo_keywords',
    ];

    public array $translatable = ['name', 'description', 'meta_title', 'meta_description'];

    protected $casts = [
        'gallery' => 'array',
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function tours()
    {
        return $this->hasMany(Tour::class);
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }

    public function hotels()
    {
        return $this->hasMany(Hotel::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCountry($query, $country)
    {
        return $query->where('country', $country);
    }
}