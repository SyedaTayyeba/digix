<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
                'nullable',
                'array',
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

        $oldValues = Setting::whereIn('key', $this->keys)
            ->get()
            ->keyBy('key')
            ->map(fn ($setting) => $setting->value)
            ->toArray();

        DB::transaction(function () use ($validated) {
            foreach ($validated as $key => $value) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        });

        $newValues = Setting::whereIn('key', $this->keys)
            ->get()
            ->keyBy('key')
            ->map(fn ($setting) => $setting->value)
            ->toArray();

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
