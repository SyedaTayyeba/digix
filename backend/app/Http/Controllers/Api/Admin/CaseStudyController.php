<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CaseStudyController extends Controller
{
    public function index()
    {
        return response()->json(
            CaseStudy::with([
                'translations',
                'categories',
            ])
            ->orderBy('sort_order')
            ->paginate(20)
        );
    }

    public function show(CaseStudy $caseStudy)
    {
        return response()->json(
            $caseStudy->load([
                'translations',
                'categories',
            ])
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|max:255|unique:case_studies,slug',
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'client_name' => 'nullable|string|max:255',
            'project_url' => 'nullable|url|max:255',
            'featured_image' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',

            'translations' => 'required|array|min:1',
            'translations.*.locale' => 'required|in:en,ar',
            'translations.*.title' => 'required|string|max:255',
            'translations.*.short_description' => 'nullable|string',
            'translations.*.description' => 'nullable|string',
            'translations.*.industry' => 'nullable|string|max:255',
            'translations.*.location' => 'nullable|string|max:255',

            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:case_study_categories,id',
        ]);

        $caseStudy = DB::transaction(function () use ($validated) {

            $slug = $validated['slug']
                ?? Str::slug($validated['translations'][0]['title']);

            $caseStudy = CaseStudy::create([
                'slug' => $slug,
                'status' => $validated['status'] ?? 'draft',
                'client_name' => $validated['client_name'] ?? null,
                'project_url' => $validated['project_url'] ?? null,
                'featured_image' => $validated['featured_image'] ?? null,
                'sort_order' => $validated['sort_order'] ?? 0,
            ]);

            foreach ($validated['translations'] as $translation) {
                $caseStudy->translations()->create($translation);
            }

            if (!empty($validated['category_ids'])) {
                $caseStudy->categories()->sync($validated['category_ids']);
            }

            return $caseStudy->fresh()->load([
                'translations',
                'categories',
            ]);
        });

        // Audit Log: Created
        ActivityLogger::log(
            'created',
            'case-studies',
            $caseStudy,
            null,
            $caseStudy->toArray()
        );

        return response()->json(
            $caseStudy,
            201
        );
    }

    public function update(Request $request, CaseStudy $caseStudy)
    {
        $validated = $request->validate([
            'slug' => 'nullable|string|max:255|unique:case_studies,slug,' . $caseStudy->id,
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'client_name' => 'nullable|string|max:255',
            'project_url' => 'nullable|url|max:255',
            'featured_image' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',

            'translations' => 'nullable|array',
            'translations.*.locale' => 'required|in:en,ar',
            'translations.*.title' => 'required|string|max:255',
            'translations.*.short_description' => 'nullable|string',
            'translations.*.description' => 'nullable|string',
            'translations.*.industry' => 'nullable|string|max:255',
            'translations.*.location' => 'nullable|string|max:255',

            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:case_study_categories,id',
        ]);

        // Old values before update
        $oldValues = $caseStudy->load([
            'translations',
            'categories',
        ])->toArray();

        DB::transaction(function () use ($validated, $caseStudy) {

            $caseStudy->update([
                'slug' => $validated['slug'] ?? $caseStudy->slug,
                'status' => $validated['status'] ?? $caseStudy->status,
                'client_name' => $validated['client_name'] ?? $caseStudy->client_name,
                'project_url' => $validated['project_url'] ?? $caseStudy->project_url,
                'featured_image' => $validated['featured_image'] ?? $caseStudy->featured_image,
                'sort_order' => $validated['sort_order'] ?? $caseStudy->sort_order,
            ]);

            if (isset($validated['translations'])) {

                $caseStudy->translations()->delete();

                foreach ($validated['translations'] as $translation) {
                    $caseStudy->translations()->create($translation);
                }
            }

            if (isset($validated['category_ids'])) {
                $caseStudy->categories()->sync($validated['category_ids']);
            }
        });

        $updatedCaseStudy = $caseStudy->fresh()->load([
            'translations',
            'categories',
        ]);

        // Audit Log: Updated
        ActivityLogger::log(
            'updated',
            'case-studies',
            $updatedCaseStudy,
            $oldValues,
            $updatedCaseStudy->toArray()
        );

        return response()->json(
            $updatedCaseStudy
        );
    }

    public function destroy(CaseStudy $caseStudy)
    {
        // Save old values before soft delete
        $oldValues = $caseStudy->load([
            'translations',
            'categories',
        ])->toArray();

        // Soft delete
        $caseStudy->delete();

        // Audit Log: Deleted
        ActivityLogger::log(
            'deleted',
            'case-studies',
            $caseStudy,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Case study deleted successfully.',
        ]);
    }

    public function publish(CaseStudy $caseStudy)
    {
        $oldValues = $caseStudy->load([
            'translations',
            'categories',
        ])->toArray();

        $caseStudy->update([
            'status' => 'published',
        ]);

        $updatedCaseStudy = $caseStudy->fresh()->load([
            'translations',
            'categories',
        ]);

        // Audit Log: Published
        ActivityLogger::log(
            'published',
            'case-studies',
            $updatedCaseStudy,
            $oldValues,
            $updatedCaseStudy->toArray()
        );

        return response()->json([
            'message' => 'Case study published successfully.',
            'case_study' => $updatedCaseStudy,
        ]);
    }

    public function archive(CaseStudy $caseStudy)
    {
        $oldValues = $caseStudy->load([
            'translations',
            'categories',
        ])->toArray();

        $caseStudy->update([
            'status' => 'archived',
        ]);

        $updatedCaseStudy = $caseStudy->fresh()->load([
            'translations',
            'categories',
        ]);

        // Audit Log: Archived
        ActivityLogger::log(
            'archived',
            'case-studies',
            $updatedCaseStudy,
            $oldValues,
            $updatedCaseStudy->toArray()
        );

        return response()->json([
            'message' => 'Case study archived successfully.',
            'case_study' => $updatedCaseStudy,
        ]);
    }
}