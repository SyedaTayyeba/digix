<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::query()
            ->where('status', 'published')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $testimonials,
        ]);
    }

    public function show(Testimonial $testimonial)
    {
        abort_unless(
            $testimonial->status === 'published',
            404
        );

        return response()->json([
            'data' => $testimonial,
        ]);
    }
}
