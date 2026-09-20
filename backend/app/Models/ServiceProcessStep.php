<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceProcessStep extends Model
{
    protected $fillable = [
        'service_id',
        'locale',
        'title',
        'description',
        'sort_order',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}