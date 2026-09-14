<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(
            Service::with([
                'features',
                'processSteps',
            ])
                ->orderBy('sort_order')
                ->paginate(20)
        );
    }

    public function show(Service $service)
    {
        return response()->json(
            $service->load([
                'features',
                'processSteps',
            ])
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:services,slug',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'short_description' => [
                'nullable',
                'string',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'nullable',
                'in:draft,published,unpublished,archived',
            ],

            'sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'custom_attributes' => [
                'nullable',
                'array',
            ],

            'features' => [
                'nullable',
                'array',
            ],

            'features.*.title' => [
                'required',
                'string',
                'max:255',
            ],

            'features.*.sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'process_steps' => [
                'nullable',
                'array',
            ],

            'process_steps.*.title' => [
                'required',
                'string',
                'max:255',
            ],

            'process_steps.*.description' => [
                'nullable',
                'string',
            ],

            'process_steps.*.sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],
        ]);

        $service = DB::transaction(function () use ($validated) {

            $slug = $validated['slug']
                ?? Str::slug($validated['title']);

            $service = Service::create([
                'slug' => $slug,
                'title' => $validated['title'],
                'short_description' => $validated['short_description'] ?? null,
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'] ?? 'draft',
                'sort_order' => $validated['sort_order'] ?? 0,
                'custom_attributes' => $validated['custom_attributes'] ?? null,
            ]);

            foreach ($validated['features'] ?? [] as $feature) {
                $service->features()->create([
                    'title' => $feature['title'],
                    'sort_order' => $feature['sort_order'] ?? 0,
                ]);
            }

            foreach ($validated['process_steps'] ?? [] as $step) {
                $service->processSteps()->create([
                    'title' => $step['title'],
                    'description' => $step['description'] ?? null,
                    'sort_order' => $step['sort_order'] ?? 0,
                ]);
            }

            return $service->fresh()->load([
                'features',
                'processSteps',
            ]);
        });

        ActivityLogger::log(
            'created',
            'services',
            $service,
            null,
            $service->toArray()
        );

        return response()->json(
            $service,
            201
        );
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:services,slug,' . $service->id,
            ],

            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'short_description' => [
                'nullable',
                'string',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'nullable',
                'in:draft,published,unpublished,archived',
            ],

            'sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'custom_attributes' => [
                'nullable',
                'array',
            ],

            'features' => [
                'nullable',
                'array',
            ],

            'features.*.title' => [
                'required',
                'string',
                'max:255',
            ],

            'features.*.sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'process_steps' => [
                'nullable',
                'array',
            ],

            'process_steps.*.title' => [
                'required',
                'string',
                'max:255',
            ],

            'process_steps.*.description' => [
                'nullable',
                'string',
            ],

            'process_steps.*.sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],
        ]);

        $oldValues = $service->load([
            'features',
            'processSteps',
        ])->toArray();

        DB::transaction(function () use ($validated, $service) {

            $service->update([
                'slug' => $validated['slug'] ?? $service->slug,
                'title' => $validated['title'] ?? $service->title,
                'short_description' =>
                    array_key_exists('short_description', $validated)
                        ? $validated['short_description']
                        : $service->short_description,
                'description' =>
                    array_key_exists('description', $validated)
                        ? $validated['description']
                        : $service->description,
                'status' => $validated['status'] ?? $service->status,
                'sort_order' => $validated['sort_order'] ?? $service->sort_order,
                'custom_attributes' =>
                    array_key_exists('custom_attributes', $validated)
                        ? $validated['custom_attributes']
                        : $service->custom_attributes,
            ]);

            if (isset($validated['features'])) {
                $service->features()->delete();

                foreach ($validated['features'] as $feature) {
                    $service->features()->create([
                        'title' => $feature['title'],
                        'sort_order' => $feature['sort_order'] ?? 0,
                    ]);
                }
            }

            if (isset($validated['process_steps'])) {
                $service->processSteps()->delete();

                foreach ($validated['process_steps'] as $step) {
                    $service->processSteps()->create([
                        'title' => $step['title'],
                        'description' => $step['description'] ?? null,
                        'sort_order' => $step['sort_order'] ?? 0,
                    ]);
                }
            }
        });

        $updatedService = $service->fresh()->load([
            'features',
            'processSteps',
        ]);

        ActivityLogger::log(
            'updated',
            'services',
            $updatedService,
            $oldValues,
            $updatedService->toArray()
        );

        return response()->json(
            $updatedService
        );
    }

    public function destroy(Service $service)
    {
        $oldValues = $service->load([
            'features',
            'processSteps',
        ])->toArray();

        $service->delete();

        ActivityLogger::log(
            'deleted',
            'services',
            $service,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Service deleted successfully.',
        ]);
    }

    public function publish(Service $service)
    {
        $oldValues = $service->load([
            'features',
            'processSteps',
        ])->toArray();

        $service->update([
            'status' => 'published',
        ]);

        $updatedService = $service->fresh()->load([
            'features',
            'processSteps',
        ]);

        ActivityLogger::log(
            'published',
            'services',
            $updatedService,
            $oldValues,
            $updatedService->toArray()
        );

        return response()->json([
            'message' => 'Service published successfully.',
            'service' => $updatedService,
        ]);
    }
}
