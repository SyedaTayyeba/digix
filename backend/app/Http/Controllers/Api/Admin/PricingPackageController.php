<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingPackage;
use App\Services\ActivityLogger;
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
            'price' => 'nullable',
            'currency' => 'nullable|string|max:10',
            'billing_period' => 'nullable|string|max:50',
            'description' => 'nullable|string',

            'is_popular' => 'nullable|boolean',
            'cta_text' => 'nullable|string|max:255',

            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',

            'features' => 'nullable|array',
            'features.*' => 'required',
        ]);

        $package = DB::transaction(function () use ($data) {
            $package = PricingPackage::create([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'price' => $data['price'] ?? null,
                'currency' => $data['currency'] ?? 'AED',
                'billing_period' => $data['billing_period'] ?? null,
                'description' => $data['description'] ?? null,
                'is_popular' => $data['is_popular'] ?? false,
                'cta_text' => $data['cta_text'] ?? null,
                'status' => $data['status'] ?? 'draft',
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            foreach ($data['features'] ?? [] as $index => $feature) {
                $featureText = is_array($feature)
                    ? ($feature['feature'] ?? $feature['title'] ?? '')
                    : $feature;

                if (trim((string) $featureText) === '') {
                    continue;
                }

                $package->features()->create([
                    'feature' => $featureText,
                    'sort_order' => is_array($feature)
                        ? ($feature['sort_order'] ?? $index)
                        : $index,
                ]);
            }

            return $package;
        });

        ActivityLogger::log(
            'created',
            'pricing_packages',
            $package,
            null,
            $package->toArray()
        );

        return response()->json(
            $package->fresh()->load('features'),
            201
        );
    }

    public function update(
        Request $request,
        PricingPackage $pricingPackage
    ) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pricing_packages,slug,' . $pricingPackage->id,
            'price' => 'nullable',
            'currency' => 'nullable|string|max:10',
            'billing_period' => 'nullable|string|max:50',
            'description' => 'nullable|string',

            'is_popular' => 'nullable|boolean',
            'cta_text' => 'nullable|string|max:255',

            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',

            'features' => 'nullable|array',
            'features.*' => 'required',
        ]);

        $oldValues = $pricingPackage->toArray();

        DB::transaction(function () use ($data, $pricingPackage) {
            $pricingPackage->update([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? $pricingPackage->slug,
                'price' => $data['price'] ?? null,
                'currency' => $data['currency'] ?? 'AED',
                'billing_period' => $data['billing_period'] ?? null,
                'description' => $data['description'] ?? null,
                'is_popular' => $data['is_popular'] ?? false,
                'cta_text' => $data['cta_text'] ?? null,
                'status' => $data['status'] ?? $pricingPackage->status,
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            if (isset($data['features'])) {
                $pricingPackage->features()->delete();

                foreach ($data['features'] as $index => $feature) {
                    $featureText = is_array($feature)
                        ? ($feature['feature'] ?? $feature['title'] ?? '')
                        : $feature;

                    if (trim((string) $featureText) === '') {
                        continue;
                    }

                    $pricingPackage->features()->create([
                        'feature' => $featureText,
                        'sort_order' => is_array($feature)
                            ? ($feature['sort_order'] ?? $index)
                            : $index,
                    ]);
                }
            }
        });

        ActivityLogger::log(
            'updated',
            'pricing_packages',
            $pricingPackage,
            $oldValues,
            $pricingPackage->fresh()->toArray()
        );

        return response()->json(
            $pricingPackage->fresh()->load('features')
        );
    }

    public function destroy(PricingPackage $pricingPackage)
    {
        $oldValues = $pricingPackage->toArray();

        $pricingPackage->delete();

        ActivityLogger::log(
            'deleted',
            'pricing_packages',
            $pricingPackage,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Pricing package deleted successfully.',
        ]);
    }

    public function publish(PricingPackage $pricingPackage)
    {
        $oldValues = $pricingPackage->toArray();

        $pricingPackage->update([
            'status' => 'published',
        ]);

        ActivityLogger::log(
            'published',
            'pricing_packages',
            $pricingPackage,
            $oldValues,
            $pricingPackage->fresh()->toArray()
        );

        return response()->json([
            'message' => 'Pricing package published successfully.',
            'package' => $pricingPackage->fresh()->load('features'),
        ]);
    }
}
