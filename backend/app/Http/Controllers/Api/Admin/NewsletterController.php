<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function index(Request $request)
    {
        $query = NewsletterSubscriber::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('email', 'like', "%{$search}%");
        }

        return response()->json(
            $query
                ->orderByDesc('id')
                ->paginate(20)
        );
    }

    public function show(NewsletterSubscriber $newsletterSubscriber)
    {
        return response()->json($newsletterSubscriber);
    }

    public function updateStatus(
        Request $request,
        NewsletterSubscriber $newsletterSubscriber
    ) {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:subscribed,unsubscribed',
            ],
        ]);

        $oldValues = $newsletterSubscriber->toArray();

        $newsletterSubscriber->update([
            'status' => $validated['status'],
            'subscribed_at' => $validated['status'] === 'subscribed'
                ? now()
                : $newsletterSubscriber->subscribed_at,
            'unsubscribed_at' => $validated['status'] === 'unsubscribed'
                ? now()
                : null,
        ]);

        ActivityLogger::log(
            'updated',
            'newsletter',
            $newsletterSubscriber,
            $oldValues,
            $newsletterSubscriber->fresh()->toArray()
        );

        return response()->json([
            'message' => 'Subscriber status updated successfully.',
            'data' => $newsletterSubscriber->fresh(),
        ]);
    }

    public function destroy(NewsletterSubscriber $newsletterSubscriber)
    {
        $oldValues = $newsletterSubscriber->toArray();

        $newsletterSubscriber->delete();

        ActivityLogger::log(
            'deleted',
            'newsletter',
            $newsletterSubscriber,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Subscriber deleted successfully.',
        ]);
    }
}