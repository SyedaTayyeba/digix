<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;

class TeamController extends Controller
{
    public function index()
    {
        $team = TeamMember::query()
            ->where('status', 'published')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $team,
        ]);
    }

    public function show(TeamMember $teamMember)
    {
        abort_unless(
            $teamMember->status === 'published',
            404
        );

        return response()->json([
            'data' => $teamMember,
        ]);
    }
}
