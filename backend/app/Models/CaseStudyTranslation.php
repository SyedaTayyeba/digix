<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudyTranslation extends Model
{
    protected $fillable = [
        'case_study_id',
        'locale',
        'title',
        'short_description',
        'description',
        'industry',
        'location',
    ];

    public function caseStudy()
    {
        return $this->belongsTo(CaseStudy::class);
    }
}