<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'service',
        'appointment_date',
        'appointment_time',
        'time_preference',
        'meeting_type',
        'message',
        'status',
        'admin_notes',
        'meeting_link',
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];
}