<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
            ],
        ]);

       $subscriber = NewsletterSubscriber::where(
    'email',
    $validated['email']
)->first();

        if ($subscriber) {
            $subscriber->update([
                'status' => 'subscribed',
                'subscribed_at' => Carbon::now(),
                'unsubscribed_at' => null,
            ]);
        } else {
            $subscriber = NewsletterSubscriber::create([
                'email' => $validated['email'],
                'status' => 'subscribed',
                'subscribed_at' => Carbon::now(),
            ]);
        }

        return response()->json([
            'message' => 'You have successfully subscribed to our newsletter.',
            'data' => $subscriber,
        ], 201);
    }

    /**
     * Unsubscribe from newsletter
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
            ],
        ]);

        $subscriber = NewsletterSubscriber::where(
            'email',
            $validated['email']
        )->first();

        if (!$subscriber) {
            return response()->json([
                'message' => 'Subscriber not found.',
            ], 404);
        }

        $subscriber->update([
            'status' => 'unsubscribed',
            'unsubscribed_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'You have been unsubscribed successfully.',
        ]);
    }
}