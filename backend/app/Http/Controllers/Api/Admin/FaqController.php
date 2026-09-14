<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FaqController extends Controller
{
    public function index()
    {
        return response()->json(
            Faq::with('category')
                ->orderBy('sort_order')
                ->paginate(20)
        );
    }

    public function show(Faq $faq)
    {
        return response()->json($faq->load('category'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'faq_category_id' => ['nullable', 'exists:faq_categories,id'],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'status' => ['nullable', 'in:draft,published,unpublished,archived'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $faq = Faq::create($data);

        return response()->json($faq->load('category'), 201);
    }

    public function update(Request $request, Faq $faq)
    {
        $data = $request->validate([
            'faq_category_id' => ['nullable', 'exists:faq_categories,id'],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'status' => ['nullable', 'in:draft,published,unpublished,archived'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $faq->update($data);

        return response()->json($faq->load('category'));
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();

        return response()->json([
            'message' => 'FAQ deleted successfully'
        ]);
    }

    public function publish(Faq $faq)
    {
        $faq->update(['status' => 'published']);

        return response()->json($faq);
    }

    public function unpublish(Faq $faq)
    {
        $faq->update(['status' => 'unpublished']);

        return response()->json($faq);
    }
}