<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Public services listing.
     */
    public function index(Request $request)
    {
        $query = Service::with([
            'translations',
            'features',
            'processSteps',
        ])
            ->where('status', 'published')
            ->orderBy('sort_order');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('translations', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere(
                        'description',
                        'like',
                        "%{$search}%"
                    );
            });
        }

        return response()->json(
            $query->paginate(
                $request->integer('per_page', 12)
            )
        );
    }

    /**
     * Public service details.
     */
    public function show(string $slug)
    {
        $service = Service::with([
            'translations',
            'features',
            'processSteps',
        ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($service);
    }
}