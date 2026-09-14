<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with([
            'tags',
            'author',
            'seo',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->latest()->paginate(20)
        );
    }

    public function show(BlogPost $blogPost)
    {
        return response()->json(
            $blogPost->load([
                'tags',
                'author',
                'seo',
            ])
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'unique:blog_posts,slug'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'string'],
            'status' => [
                'nullable',
                'in:draft,published,unpublished,archived'
            ],
            'published_at' => ['nullable', 'date'],

            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['exists:blog_tags,id'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        $data['author_id'] = auth()->id();

        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $post = DB::transaction(function () use ($data, $tagIds) {

            $post = BlogPost::create($data);

            $post->tags()->sync($tagIds);

            return $post->fresh()->load([
                'tags',
                'author',
                'seo',
            ]);
        });

        ActivityLogger::log(
            'created',
            'blog',
            $post,
            null,
            $post->toArray()
        );

        return response()->json(
            $post,
            201
        );
    }

    public function update(Request $request, BlogPost $blogPost)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'unique:blog_posts,slug,' . $blogPost->id
            ],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'string'],
            'status' => [
                'nullable',
                'in:draft,published,unpublished,archived'
            ],
            'published_at' => ['nullable', 'date'],

            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['exists:blog_tags,id'],
        ]);

        $oldValues = $blogPost->load([
            'tags',
            'author',
            'seo',
        ])->toArray();

        $tagIds = $data['tag_ids'] ?? null;
        unset($data['tag_ids']);

        DB::transaction(function () use ($blogPost, $data, $tagIds) {

            $blogPost->update($data);

            if ($tagIds !== null) {
                $blogPost->tags()->sync($tagIds);
            }
        });

        $updatedPost = $blogPost->fresh()->load([
            'tags',
            'author',
            'seo',
        ]);

        ActivityLogger::log(
            'updated',
            'blog',
            $updatedPost,
            $oldValues,
            $updatedPost->toArray()
        );

        return response()->json(
            $updatedPost
        );
    }

    public function publish(BlogPost $blogPost)
    {
        $oldValues = $blogPost->toArray();

        $blogPost->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        $publishedPost = $blogPost->fresh()->load([
            'tags',
            'author',
            'seo',
        ]);

        ActivityLogger::log(
            'published',
            'blog',
            $publishedPost,
            $oldValues,
            $publishedPost->toArray()
        );

        return response()->json([
            'message' => 'Blog post published successfully',
            'blog_post' => $publishedPost,
        ]);
    }

    public function destroy(BlogPost $blogPost)
    {
        $oldValues = $blogPost->load([
            'tags',
            'author',
            'seo',
        ])->toArray();

        $blogPost->delete();

        ActivityLogger::log(
            'deleted',
            'blog',
            $blogPost,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Blog post deleted successfully'
        ]);
    }
}