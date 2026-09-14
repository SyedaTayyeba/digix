<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use App\Models\Service;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeoController extends Controller
{
    public function show(string $type, int $id)
    {
        $seoable = $this->findSeoable($type, $id);

        return response()->json([
            'data' => $seoable->seo,
        ]);
    }

    public function update(Request $request, string $type, int $id)
    {
        $seoable = $this->findSeoable($type, $id);

        $validated = $request->validate([
            'meta_title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'meta_description' => [
                'nullable',
                'string',
                'max:500',
            ],

            'canonical_url' => [
                'nullable',
                'url',
                'max:500',
            ],

            'og_title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'og_description' => [
                'nullable',
                'string',
                'max:500',
            ],

            'og_image' => [
                'nullable',
                'string',
                'max:500',
            ],

            'schema' => [
                'nullable',
                'array',
            ],
        ]);

        $oldValues = $seoable->seo?->toArray();

        $seo = DB::transaction(function () use (
            $seoable,
            $validated
        ) {
            return $seoable->seo()->updateOrCreate(
                [],
                $validated
            );
        });

        ActivityLogger::log(
            'updated',
            'seo',
            $seoable,
            $oldValues,
            $seo->toArray()
        );

        return response()->json([
            'message' => 'SEO metadata updated successfully.',
            'data' => $seo,
        ]);
    }

    private function findSeoable(string $type, int $id)
    {
        return match ($type) {
            'services' => Service::with('seo')->findOrFail($id),
            'case-studies' => CaseStudy::with('seo')->findOrFail($id),
            default => abort(404, 'Unsupported SEO resource.'),
        };
    }
}
