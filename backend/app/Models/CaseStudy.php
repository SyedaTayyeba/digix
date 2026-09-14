<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CaseStudy extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'status',
        'client_name',
        'project_url',
        'featured_image',
        'sort_order',
    ];

    public function translations()
    {
        return $this->hasMany(CaseStudyTranslation::class);
    }

    public function categories()
    {
        return $this->belongsToMany(
            CaseStudyCategory::class,
            'case_study_category'
        );
    }
    public function seo()
{
    return $this->morphOne(SeoMeta::class, 'seoable');
}
}