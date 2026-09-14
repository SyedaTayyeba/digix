<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadStageHistory extends Model
{
    protected $fillable = [
        'lead_id',
        'from_stage',
        'to_stage',
        'changed_by',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}