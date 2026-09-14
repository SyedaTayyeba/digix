<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilitySlot extends Model
{
    protected $fillable = [
        'day_of_week',
        'start_time',
        'end_time',
        'slot_duration',
        'buffer_time',
        'is_available',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'slot_duration' => 'integer',
        'buffer_time' => 'integer',
        'is_available' => 'boolean',
    ];
}