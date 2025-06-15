<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }
}