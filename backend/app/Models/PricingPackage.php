<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PricingPackage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'currency',
        'billing_period',
        'description',
        'is_featured',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    public function features()
    {
        return $this->hasMany(PricingFeature::class);
    }
}