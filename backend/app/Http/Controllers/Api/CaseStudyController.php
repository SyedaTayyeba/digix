<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use Illuminate\Http\Request;

class CaseStudyController extends Controller
{
    /**
     * Public case studies listing.
     */
    public function index(Request $request)
    {
        $query = CaseStudy::with([
            'translations',
            'categories',
        ])
            ->where('status', 'published')
            ->orderBy('sort_order');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('translations', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere(
                        'short_description',
                        'like',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'description',
                        'like',
                        "%{$search}%"
                    );
            });
        }

        if ($request->filled('category_id')) {
            $categoryId = $request->category_id;

            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('case_study_categories.id', $categoryId);
            });
        }

        return response()->json(
            $query->paginate(
                $request->integer('per_page', 12)
            )
        );
    }

    /**
     * Public case study details.
     */
    public function show(string $slug)
    {
        $caseStudy = CaseStudy::with([
            'translations',
            'categories',
        ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($caseStudy);
    }
}
