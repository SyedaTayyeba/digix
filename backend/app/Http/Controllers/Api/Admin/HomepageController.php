<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class HomepageController extends Controller
{
    private array $keys = [
        'homepage_hero',
        'homepage_about',
        'homepage_services',
        'homepage_case_studies',
        'homepage_testimonials',
        'homepage_cta',
        'homepage_stats',
    ];

    public function index()
    {
        $settings = Setting::whereIn('key', $this->keys)
            ->get()
            ->keyBy('key');

        $data = [];

        foreach ($this->keys as $key) {
            $data[$key] = $settings->has($key)
                ? $settings->get($key)->value
                : null;
        }

        /*
        |--------------------------------------------------------------------------
        | Resolve selected homepage services
        |--------------------------------------------------------------------------
        */

        $homepageServices = $data['homepage_services'] ?? [];

        if (!is_array($homepageServices)) {
            $homepageServices = [];
        }

        $selectedIds = $homepageServices['selected_service_ids'] ?? [];

        if (!is_array($selectedIds)) {
            $selectedIds = [];
        }

        $selectedIds = collect($selectedIds)
            ->filter(fn ($id) => is_numeric($id))
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->all();

        $homepageServices['selected_service_ids'] = $selectedIds;

        $data['homepage_services'] = $homepageServices;

        return response()->json([
            'data' => $data,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'homepage_hero' => [
                'nullable',
                'array',
            ],

            'homepage_about' => [
                'nullable',
                'array',
            ],

            'homepage_services' => [
                'required',
                'array',
            ],

            'homepage_services.selected_service_ids' => [
                'required',
                'array',
                'size:3',
            ],

            'homepage_services.selected_service_ids.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('services', 'id')
                    ->whereNull('deleted_at'),
            ],

            'homepage_case_studies' => [
                'nullable',
                'array',
            ],

            'homepage_testimonials' => [
                'nullable',
                'array',
            ],

            'homepage_cta' => [
                'nullable',
                'array',
            ],

            'homepage_stats' => [
                'nullable',
                'array',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Normalize selected service IDs
        |--------------------------------------------------------------------------
        */

        if (
            isset($validated['homepage_services']['selected_service_ids'])
        ) {
            $validated['homepage_services']['selected_service_ids'] =
                collect(
                    $validated['homepage_services']['selected_service_ids']
                )
                    ->map(fn ($id) => (int) $id)
                    ->unique()
                    ->values()
                    ->all();
        }

        /*
        |--------------------------------------------------------------------------
        | Get old values for audit log
        |--------------------------------------------------------------------------
        */

        $oldValues = Setting::whereIn('key', $this->keys)
            ->get()
            ->keyBy('key')
            ->map(fn ($setting) => $setting->value)
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Save homepage settings
        |--------------------------------------------------------------------------
        */

        DB::transaction(function () use ($validated) {
            foreach ($validated as $key => $value) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Get fresh values
        |--------------------------------------------------------------------------
        */

        $newValues = Setting::whereIn('key', $this->keys)
            ->get()
            ->keyBy('key')
            ->map(fn ($setting) => $setting->value)
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Audit log
        |--------------------------------------------------------------------------
        */

        ActivityLogger::log(
            'updated',
            'homepage',
            null,
            $oldValues,
            $newValues
        );

        return response()->json([
            'message' => 'Homepage content updated successfully.',
            'data' => $newValues,
        ]);
    }
}