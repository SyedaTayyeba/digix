<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::with('category')
            ->where('status', 'published')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $faqs,
        ]);
    }

    public function show(Faq $faq)
    {
        abort_unless(
            $faq->status === 'published',
            404
        );

        return response()->json([
            'data' => $faq->load('category'),
        ]);
    }
}
