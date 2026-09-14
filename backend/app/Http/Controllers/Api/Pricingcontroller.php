<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingPackage;

class PricingController extends Controller
{
    public function index()
    {
        $packages = PricingPackage::with('features')
            ->where('status', 'published')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $packages,
        ]);
    }

    public function show(string $slug)
    {
        $package = PricingPackage::with('features')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json([
            'data' => $package,
        ]);
    }
}
