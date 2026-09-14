<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseStudyCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CaseStudyCategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            CaseStudyCategory::orderBy('name')->get()
        );
    }

    public function show(CaseStudyCategory $caseStudyCategory)
    {
        return response()->json(
            $caseStudyCategory->load('caseStudies')
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:case_study_categories,slug',
        ]);

        $category = CaseStudyCategory::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
        ]);

        return response()->json($category, 201);
    }

    public function update(
        Request $request,
        CaseStudyCategory $caseStudyCategory
    ) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:case_study_categories,slug,' . $caseStudyCategory->id,
        ]);

        $caseStudyCategory->update([
            'name' => $validated['name'],
            'slug' => $validated['slug']
                ?? Str::slug($validated['name']),
        ]);

        return response()->json($caseStudyCategory);
    }

    public function destroy(CaseStudyCategory $caseStudyCategory)
    {
        $caseStudyCategory->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }
}