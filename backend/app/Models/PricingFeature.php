<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingFeature extends Model
{
    protected $fillable = [
        'pricing_package_id',
        'feature',
        'sort_order',
    ];

    public function package()
    {
        return $this->belongsTo(PricingPackage::class, 'pricing_package_id');
    }
}