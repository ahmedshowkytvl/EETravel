<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'country_id',
        'is_featured',
        'image_url',
        'gallery',
        'active'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'active' => 'boolean',
        'gallery' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function tours()
    {
        return $this->hasMany(Tour::class);
    }

    public function hotels()
    {
        return $this->hasMany(Hotel::class);
    }
}