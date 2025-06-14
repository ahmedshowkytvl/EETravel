<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tour_id',
        'package_id',
        'hotel_id',
        'booking_number',
        'status',
        'booking_date',
        'travel_date',
        'return_date',
        'adults',
        'children',
        'infants',
        'total_amount',
        'paid_amount',
        'payment_status',
        'payment_method',
        'special_requests',
        'customer_details',
        'emergency_contact',
        'cancellation_reason',
        'cancelled_at',
        'confirmed_at',
    ];

    protected $casts = [
        'booking_date' => 'datetime',
        'travel_date' => 'date',
        'return_date' => 'date',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'customer_details' => 'array',
        'emergency_contact' => 'array',
        'cancelled_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_COMPLETED = 'completed';

    const PAYMENT_STATUS_PENDING = 'pending';
    const PAYMENT_STATUS_PARTIAL = 'partial';
    const PAYMENT_STATUS_PAID = 'paid';
    const PAYMENT_STATUS_REFUNDED = 'refunded';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    public function getRemainingAmountAttribute()
    {
        return $this->total_amount - $this->paid_amount;
    }

    public function getTotalParticipantsAttribute()
    {
        return $this->adults + $this->children + $this->infants;
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($booking) {
            $booking->booking_number = 'SJ' . strtoupper(uniqid());
        });
    }
}