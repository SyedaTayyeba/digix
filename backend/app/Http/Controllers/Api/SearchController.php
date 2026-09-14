<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Service;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $search = trim($validated['q']);

        /*
        |--------------------------------------------------------------------------
        | Services
        |--------------------------------------------------------------------------
        */

        $services = Service::query()
            ->where('status', 'published')
            ->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->limit(20)
            ->get([
                'id',
                'slug',
                'title',
                'short_description',
                'description',
            ]);

        /*
        |--------------------------------------------------------------------------
        | FAQs
        |--------------------------------------------------------------------------
        */

        $faqs = Faq::query()
            ->where('status', 'published')
            ->where(function ($query) use ($search) {
                $query->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            })
            ->latest()
            ->limit(20)
            ->get([
                'id',
                'question',
                'answer',
            ]);

        return response()->json([
            'query' => $search,

            'services' => $services,

            'faqs' => $faqs,

            'total' => $services->count() + $faqs->count(),
        ]);
    }
}
