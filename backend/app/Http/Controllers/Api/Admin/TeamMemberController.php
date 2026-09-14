<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        return response()->json(
            TeamMember::orderBy('sort_order')->paginate(20)
        );
    }

    public function show(TeamMember $teamMember)
    {
        return response()->json($teamMember);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'bio' => 'nullable|string',
            'social_links' => 'nullable|array',
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $member = TeamMember::create($data);

        return response()->json([
            'message' => 'Team member created successfully.',
            'team_member' => $member,
        ], 201);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'bio' => 'nullable|string',
            'social_links' => 'nullable|array',
            'status' => 'nullable|in:draft,published,unpublished,archived',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $teamMember->update($data);

        return response()->json([
            'message' => 'Team member updated successfully.',
            'team_member' => $teamMember->fresh(),
        ]);
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();

        return response()->json([
            'message' => 'Team member deleted successfully.',
        ]);
    }

    public function publish(TeamMember $teamMember)
    {
        $teamMember->update([
            'status' => 'published',
        ]);

        return response()->json([
            'message' => 'Team member published successfully.',
            'team_member' => $teamMember->fresh(),
        ]);
    }
}