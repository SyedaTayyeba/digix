<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogCategoryController extends Controller
{
    public function index()
    {
        return BlogCategory::latest()->get();
    }

    public function show(BlogCategory $blogCategory)
    {
        return $blogCategory;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blog_categories,slug'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return response()->json(
            BlogCategory::create($data),
            201
        );
    }

    public function update(Request $request, BlogCategory $blogCategory)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:blog_categories,slug,' . $blogCategory->id,
            ],
        ]);

        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $blogCategory->update($data);

        return $blogCategory->fresh();
    }

    public function destroy(BlogCategory $blogCategory)
    {
        $blogCategory->delete();

        return response()->json([
            'message' => 'Blog category deleted successfully.'
        ]);
    }
}