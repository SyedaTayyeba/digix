<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConversionEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function summary(Request $request)
    {
        $from = $request->input(
            'from',
            now()->subDays(30)->startOfDay()
        );

        $to = $request->input(
            'to',
            now()->endOfDay()
        );

        $events = ConversionEvent::whereBetween(
            'occurred_at',
            [$from, $to]
        );

        return response()->json([
            'total_events' => (clone $events)->count(),

            'events_by_name' => (clone $events)
                ->select(
                    'event_name',
                    DB::raw('COUNT(*) as total')
                )
                ->groupBy('event_name')
                ->orderByDesc('total')
                ->get(),

            'events_by_source' => (clone $events)
                ->select(
                    'source',
                    DB::raw('COUNT(*) as total')
                )
                ->whereNotNull('source')
                ->groupBy('source')
                ->orderByDesc('total')
                ->get(),

            'events_over_time' => (clone $events)
                ->select(
                    DB::raw('DATE(occurred_at) as date'),
                    DB::raw('COUNT(*) as total')
                )
                ->groupBy(DB::raw('DATE(occurred_at)'))
                ->orderBy('date')
                ->get(),

            'date_range' => [
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }

    public function events(Request $request)
    {
        $query = ConversionEvent::query();

        if ($request->filled('event_name')) {
            $query->where(
                'event_name',
                $request->event_name
            );
        }

        if ($request->filled('source')) {
            $query->where(
                'source',
                $request->source
            );
        }

        if ($request->filled('from')) {
            $query->where(
                'occurred_at',
                '>=',
                $request->from
            );
        }

        if ($request->filled('to')) {
            $query->where(
                'occurred_at',
                '<=',
                $request->to
            );
        }

        return response()->json(
            $query
                ->latest('occurred_at')
                ->paginate(50)
        );
    }
}
