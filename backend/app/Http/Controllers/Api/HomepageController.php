<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class HomepageController extends Controller
{
    public function index()
    {
        $keys = [
            'homepage_hero',
            'homepage_about',
            'homepage_services',
            'homepage_case_studies',
            'homepage_testimonials',
            'homepage_cta',
            'homepage_stats',
        ];

        $settings = Setting::whereIn('key', $keys)
            ->get()
            ->keyBy('key');

        return response()->json([
            'hero' => $this->value($settings, 'homepage_hero'),
            'about' => $this->value($settings, 'homepage_about'),
            'services' => $this->value($settings, 'homepage_services'),
            'case_studies' => $this->value(
                $settings,
                'homepage_case_studies'
            ),
            'testimonials' => $this->value(
                $settings,
                'homepage_testimonials'
            ),
            'cta' => $this->value($settings, 'homepage_cta'),
            'stats' => $this->value($settings, 'homepage_stats'),
        ]);
    }

    private function value($settings, string $key)
    {
        return $settings->has($key)
            ? $settings->get($key)->value
            : null;
    }
}