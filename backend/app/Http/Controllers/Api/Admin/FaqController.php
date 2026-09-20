<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FaqController extends Controller
{
    /**
     * List FAQs.
     */
    public function index()
    {
        $faqs = Faq::with('category')
            ->orderBy('sort_order')
            ->paginate(20);

        $faqs->getCollection()->transform(function ($faq) {
            $faq->category_name = $faq->category?->name;

            return $faq;
        });

        return response()->json($faqs);
    }

    /**
     * Show a single FAQ.
     */
    public function show(Faq $faq)
    {
        $faq->load('category');

        $faq->category_name = $faq->category?->name;

        return response()->json($faq);
    }

    /**
     * Create FAQ.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'faq_category_id' => [
                'nullable',
                'exists:faq_categories,id',
            ],
            'question' => [
                'required',
                'string',
                'max:255',
            ],
            'answer' => [
                'required',
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
        ]);

        $faq = DB::transaction(function () use ($data) {
            return Faq::create($data);
        });

        $faq->load('category');
        $faq->category_name = $faq->category?->name;

        ActivityLogger::log(
            'created',
            'faqs',
            $faq,
            null,
            $faq->toArray()
        );

        return response()->json([
            'data' => $faq,
        ], 201);
    }

    /**
     * Update FAQ.
     */
    public function update(Request $request, Faq $faq)
    {
        $data = $request->validate([
            'faq_category_id' => [
                'nullable',
                'exists:faq_categories,id',
            ],
            'question' => [
                'required',
                'string',
                'max:255',
            ],
            'answer' => [
                'required',
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
        ]);

        $oldValues = $faq->toArray();

        DB::transaction(function () use ($faq, $data) {
            $faq->update($data);
        });

        $faq->refresh()->load('category');
        $faq->category_name = $faq->category?->name;

        ActivityLogger::log(
            'updated',
            'faqs',
            $faq,
            $oldValues,
            $faq->toArray()
        );

        return response()->json([
            'data' => $faq,
        ]);
    }

    /**
     * Delete FAQ.
     */
    public function destroy(Faq $faq)
    {
        $oldValues = $faq->toArray();

        DB::transaction(function () use ($faq) {
            $faq->delete();
        });

        ActivityLogger::log(
            'deleted',
            'faqs',
            $faq,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'FAQ deleted successfully',
        ]);
    }

    /**
     * Publish FAQ.
     */
    public function publish(Faq $faq)
    {
        $oldValues = $faq->toArray();

        $faq->update([
            'status' => 'published',
        ]);

        $faq->refresh()->load('category');
        $faq->category_name = $faq->category?->name;

        ActivityLogger::log(
            'published',
            'faqs',
            $faq,
            $oldValues,
            $faq->toArray()
        );

        return response()->json([
            'data' => $faq,
        ]);
    }

    /**
     * Unpublish FAQ.
     */
    public function unpublish(Faq $faq)
    {
        $oldValues = $faq->toArray();

        $faq->update([
            'status' => 'unpublished',
        ]);

        $faq->refresh()->load('category');
        $faq->category_name = $faq->category?->name;

        ActivityLogger::log(
            'unpublished',
            'faqs',
            $faq,
            $oldValues,
            $faq->toArray()
        );

        return response()->json([
            'data' => $faq,
        ]);
    }
}
