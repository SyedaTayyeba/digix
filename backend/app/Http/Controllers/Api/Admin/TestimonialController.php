<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(
            Testimonial::orderBy('sort_order')->paginate(20)
        );
    }

    public function show(Testimonial $testimonial)
    {
        return response()->json($testimonial);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_role' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'required|string',
            'avatar' => 'nullable|string|max:500',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $testimonial = Testimonial::create($validated);

        return response()->json([
            'message' => 'Testimonial created successfully.',
            'testimonial' => $testimonial,
        ], 201);
    }

    public function update(
        Request $request,
        Testimonial $testimonial
    ) {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_role' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'required|string',
            'avatar' => 'nullable|string|max:500',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $testimonial->update($validated);

        return response()->json([
            'message' => 'Testimonial updated successfully.',
            'testimonial' => $testimonial->fresh(),
        ]);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json([
            'message' => 'Testimonial deleted successfully.',
        ]);
    }

    public function publish(Testimonial $testimonial)
    {
        $testimonial->update([
            'status' => 'published',
        ]);

        return response()->json([
            'message' => 'Testimonial published successfully.',
            'testimonial' => $testimonial->fresh(),
        ]);
    }

    public function unpublish(Testimonial $testimonial)
    {
        $testimonial->update([
            'status' => 'unpublished',
        ]);

        return response()->json([
            'message' => 'Testimonial unpublished successfully.',
            'testimonial' => $testimonial->fresh(),
        ]);
    }
}