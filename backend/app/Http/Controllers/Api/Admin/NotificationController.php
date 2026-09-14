<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        return response()->json($notifications);
    }

    public function unread(Request $request)
    {
        $notifications = $request->user()
            ->unreadNotifications()
            ->latest()
            ->get();

        return response()->json($notifications);
    }

    public function unreadCount(Request $request)
    {
        return response()->json([
            'count' => $request->user()
                ->unreadNotifications()
                ->count(),
        ]);
    }

    public function markAsRead(
        Request $request,
        string $notification
    ) {
        $notification = $request->user()
            ->notifications()
            ->where('id', $notification)
            ->firstOrFail();

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read.',
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()
            ->unreadNotifications()
            ->update([
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function destroy(
        Request $request,
        string $notification
    ) {
        $notification = $request->user()
            ->notifications()
            ->where('id', $notification)
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully.',
        ]);
    }
}