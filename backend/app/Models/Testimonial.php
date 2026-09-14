<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'client_name',
        'client_role',
        'company',
        'content',
        'avatar',
        'rating',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'rating' => 'integer',
        'sort_order' => 'integer',
    ];
}