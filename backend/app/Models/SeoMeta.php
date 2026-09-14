<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoMeta extends Model
{
    protected $table = 'seo_meta';

    protected $fillable = [
        'meta_title',
        'meta_description',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image',
        'schema',
    ];

    protected $casts = [
        'schema' => 'array',
    ];

    public function seoable()
    {
        return $this->morphTo();
    }
}