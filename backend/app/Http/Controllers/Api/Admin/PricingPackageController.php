<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PricingPackageController extends Controller
{
    public function index()
    {
        return response()->json(
            PricingPackage::with('features')
                ->orderBy('sort_order')
                ->paginate(20)
        );
    }

    public function show(PricingPackage $pricingPackage)
    {
        return response()->json(
            $pricingPackage->load('features')
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pricing_packages,slug',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'billing_period' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',

            'features' => 'nullable|array',
            'features.*.feature' => 'required|string|max:500',
            'features.*.sort_order' => 'nullable|integer|min:0',
        ]);

        $package = DB::transaction(function () use ($data) {

            $package = PricingPackage::create([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'price' => $data['price'] ?? null,
                'currency' => $data['currency'] ?? 'USD',
                'billing_period' => $data['billing_period'] ?? null,
                'description' => $data['description'] ?? null,
                'is_featured' => $data['is_featured'] ?? false,
                'status' => $data['status'] ?? 'draft',
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            foreach ($data['features'] ?? [] as $feature) {
                $package->features()->create($feature);
            }

            return $package;
        });

        return response()->json(
            $package->load('features'),
            201
        );
    }

    public function update(Request $request, PricingPackage $pricingPackage)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pricing_packages,slug,' . $pricingPackage->id,
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'billing_period' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',

            'features' => 'nullable|array',
            'features.*.feature' => 'required|string|max:500',
            'features.*.sort_order' => 'nullable|integer|min:0',
        ]);

        DB::transaction(function () use ($data, $pricingPackage) {

            $pricingPackage->update([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? $pricingPackage->slug,
                'price' => $data['price'] ?? null,
                'currency' => $data['currency'] ?? 'USD',
                'billing_period' => $data['billing_period'] ?? null,
                'description' => $data['description'] ?? null,
                'is_featured' => $data['is_featured'] ?? false,
                'status' => $data['status'] ?? $pricingPackage->status,
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            if (isset($data['features'])) {
                $pricingPackage->features()->delete();

                foreach ($data['features'] as $feature) {
                    $pricingPackage->features()->create($feature);
                }
            }
        });

        return response()->json(
            $pricingPackage->fresh()->load('features')
        );
    }

    public function destroy(PricingPackage $pricingPackage)
    {
        $pricingPackage->delete();

        return response()->json([
            'message' => 'Pricing package deleted successfully.',
        ]);
    }

    public function publish(PricingPackage $pricingPackage)
    {
        $pricingPackage->update([
            'status' => 'published',
        ]);

        return response()->json([
            'message' => 'Pricing package published successfully.',
            'package' => $pricingPackage->fresh()->load('features'),
        ]);
    }
}