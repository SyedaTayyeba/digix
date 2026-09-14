<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamMember extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'designation',
        'email',
        'phone',
        'image',
        'bio',
        'social_links',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'social_links' => 'array',
    ];
}