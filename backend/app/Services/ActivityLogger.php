<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    public static function log(
        string $action,
        string $module,
        ?Model $subject = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => Auth::id(),

            'action' => $action,
            'module' => $module,

            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),

            'old_values' => $oldValues,
            'new_values' => $newValues,

            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}