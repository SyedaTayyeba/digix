<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'source',
        'stage',
        'estimated_value',
        'message',
        'form_data',
        'whatsapp_clicked_at',
    ];

    protected $casts = [
        'form_data' => 'array',
        'estimated_value' => 'decimal:2',
        'whatsapp_clicked_at' => 'datetime',
    ];

    public function activities()
    {
        return $this->hasMany(LeadActivity::class);
    }

    public function stageHistories()
    {
        return $this->hasMany(LeadStageHistory::class);
    }
}