<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogTagController extends Controller
{
    public function index()
    {
        return BlogTag::latest()->get();
    }

    public function show(BlogTag $blogTag)
    {
        return $blogTag;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blog_tags,slug'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return response()->json(
            BlogTag::create($data),
            201
        );
    }

    public function update(Request $request, BlogTag $blogTag)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:blog_tags,slug,' . $blogTag->id,
            ],
        ]);

        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $blogTag->update($data);

        return $blogTag->fresh();
    }

    public function destroy(BlogTag $blogTag)
    {
        $blogTag->delete();

        return response()->json([
            'message' => 'Blog tag deleted successfully.'
        ]);
    }
}