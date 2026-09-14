<?php

namespace App\Models;

use App\Models\SeoMeta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'title',
        'short_description',
        'description',
        'status',
        'sort_order',
        'custom_attributes',
    ];

    protected $casts = [
        'custom_attributes' => 'array',
    ];

    public function features()
    {
        return $this->hasMany(ServiceFeature::class);
    }

    public function processSteps()
    {
        return $this->hasMany(ServiceProcessStep::class);
    }

    public function seo()
    {
        return $this->morphOne(SeoMeta::class, 'seoable');
    }
}