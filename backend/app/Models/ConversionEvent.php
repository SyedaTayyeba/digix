<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversionEvent extends Model
{
    protected $fillable = [
        'event_name',
        'source',
        'session_id',
        'page_url',
        'metadata',
        'occurred_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'occurred_at' => 'datetime',
    ];
}