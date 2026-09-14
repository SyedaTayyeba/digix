<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FaqCategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            FaqCategory::withCount('faqs')->latest()->paginate(20)
        );
    }

    public function show(FaqCategory $faqCategory)
    {
        return response()->json(
            $faqCategory->load('faqs')
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:faq_categories,slug'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $category = FaqCategory::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, FaqCategory $faqCategory)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:faq_categories,slug,' . $faqCategory->id
            ],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $faqCategory->update($data);

        return response()->json($faqCategory);
    }

    public function destroy(FaqCategory $faqCategory)
    {
        $faqCategory->delete();

        return response()->json([
            'message' => 'FAQ category deleted successfully'
        ]);
    }
}