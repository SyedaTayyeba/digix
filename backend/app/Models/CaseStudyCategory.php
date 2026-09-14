<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudyCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
    ];

    public function caseStudies()
    {
        return $this->belongsToMany(
            CaseStudy::class,
            'case_study_category'
        );
    }
}