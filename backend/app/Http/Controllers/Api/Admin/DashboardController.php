<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Appointment;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\TeamMember;
use App\Models\ConversionEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->input(
            'from',
            now()->subDays(30)->startOfDay()
        );

        $to = $request->input(
            'to',
            now()->endOfDay()
        );

        return response()->json([
            'summary' => [
                'total_leads' => Lead::count(),
                'new_leads' => Lead::where('stage', 'new')->count(),
                'qualified_leads' => Lead::where('stage', 'qualified')->count(),
                'won_leads' => Lead::where('stage', 'won')->count(),
                'lost_leads' => Lead::where('stage', 'lost')->count(),

                'total_appointments' => Appointment::count(),

                'total_blog_posts' => BlogPost::count(),
                'published_blog_posts' => BlogPost::where(
                    'status',
                    'published'
                )->count(),

                'total_services' => Service::count(),
                'total_case_studies' => CaseStudy::count(),
                'total_testimonials' => Testimonial::count(),
                'total_team_members' => TeamMember::count(),
            ],

            'leads_by_stage' => Lead::select(
                'stage',
                DB::raw('COUNT(*) as total')
            )
                ->groupBy('stage')
                ->orderBy('stage')
                ->get(),

            'leads_by_source' => Lead::select(
                'source',
                DB::raw('COUNT(*) as total')
            )
                ->whereNotNull('source')
                ->groupBy('source')
                ->orderByDesc('total')
                ->get(),

            'leads_over_time' => Lead::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total')
            )
                ->whereBetween('created_at', [$from, $to])
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get(),

            'conversions' => ConversionEvent::select(
                'event_name',
                DB::raw('COUNT(*) as total')
            )
                ->whereBetween('occurred_at', [$from, $to])
                ->groupBy('event_name')
                ->orderByDesc('total')
                ->get(),

            'date_range' => [
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }
}