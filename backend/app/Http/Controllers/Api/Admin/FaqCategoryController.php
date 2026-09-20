<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqCategory;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FaqCategoryController extends Controller
{
    /**
     * List FAQ categories.
     */
    public function index()
    {
        $categories = FaqCategory::withCount('faqs')
            ->orderBy('name')
            ->paginate(20);

        return response()->json($categories);
    }

    /**
     * Show a single FAQ category.
     */
    public function show(FaqCategory $faqCategory)
    {
        return response()->json(
            $faqCategory->load('faqs')
        );
    }

    /**
     * Create FAQ category.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:faq_categories,slug',
            ],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $category = DB::transaction(function () use ($data) {
            return FaqCategory::create($data);
        });

        ActivityLogger::log(
            'created',
            'faq_categories',
            $category,
            null,
            $category->toArray()
        );

        return response()->json([
            'data' => $category,
        ], 201);
    }

    /**
     * Update FAQ category.
     */
    public function update(
        Request $request,
        FaqCategory $faqCategory
    ) {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:faq_categories,slug,' . $faqCategory->id,
            ],
        ]);

        $oldValues = $faqCategory->toArray();

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        DB::transaction(function () use ($faqCategory, $data) {
            $faqCategory->update($data);
        });

        ActivityLogger::log(
            'updated',
            'faq_categories',
            $faqCategory,
            $oldValues,
            $faqCategory->fresh()->toArray()
        );

        return response()->json([
            'data' => $faqCategory->fresh(),
        ]);
    }

    /**
     * Delete FAQ category.
     */
    public function destroy(FaqCategory $faqCategory)
    {
        $oldValues = $faqCategory->toArray();

        DB::transaction(function () use ($faqCategory) {
            $faqCategory->delete();
        });

        ActivityLogger::log(
            'deleted',
            'faq_categories',
            $faqCategory,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'FAQ category deleted successfully',
        ]);
    }
}
