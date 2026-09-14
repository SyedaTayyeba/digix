<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\LeadStageHistory;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeadController extends Controller
{
    /**
     * List leads with filters and pagination.
     */
    public function index(Request $request)
    {
        $query = Lead::query()
            ->with([
                'activities',
                'stageHistories',
            ]);

        if ($request->filled('stage')) {
            $query->where('stage', $request->stage);
        }

        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query
                ->latest()
                ->paginate(20)
        );
    }

    /**
     * Show single lead with activities and stage history.
     */
    public function show(Lead $lead)
    {
        return response()->json([
            'data' => $lead->load([
                'activities' => function ($query) {
                    $query->latest();
                },
                'stageHistories' => function ($query) {
                    $query->latest();
                },
            ]),
        ]);
    }

    /**
     * Create new lead.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'company' => [
                'nullable',
                'string',
                'max:255',
            ],

            'source' => [
                'nullable',
                'string',
                'max:100',
            ],

            'stage' => [
                'nullable',
                'in:new,contacted,qualified,meeting_booked,proposal_sent,won,lost',
            ],

            'estimated_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'message' => [
                'nullable',
                'string',
            ],

            'form_data' => [
                'nullable',
                'array',
            ],
        ]);

        $data['stage'] = $data['stage'] ?? 'new';
        $data['source'] = $data['source'] ?? 'admin';

        $lead = DB::transaction(function () use ($data) {
            $lead = Lead::create($data);

            LeadStageHistory::create([
                'lead_id' => $lead->id,
                'from_stage' => null,
                'to_stage' => $lead->stage,
                'changed_by' => auth()->id(),
            ]);

            return $lead->fresh();
        });

        ActivityLogger::log(
            'created',
            'leads',
            $lead,
            null,
            $lead->toArray()
        );

        return response()->json([
            'message' => 'Lead created successfully.',
            'data' => $lead,
        ], 201);
    }

    /**
     * Update lead.
     */
    public function update(Request $request, Lead $lead)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'company' => [
                'nullable',
                'string',
                'max:255',
            ],

            'source' => [
                'nullable',
                'string',
                'max:100',
            ],

            'estimated_value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'message' => [
                'nullable',
                'string',
            ],

            'form_data' => [
                'nullable',
                'array',
            ],
        ]);

        $oldValues = $lead->toArray();

        $lead->update($data);

        $updatedLead = $lead->fresh();

        ActivityLogger::log(
            'updated',
            'leads',
            $updatedLead,
            $oldValues,
            $updatedLead->toArray()
        );

        return response()->json([
            'message' => 'Lead updated successfully.',
            'data' => $updatedLead,
        ]);
    }

    /**
     * Update lead pipeline stage.
     */
    public function updateStage(Request $request, Lead $lead)
    {
        $data = $request->validate([
            'stage' => [
                'required',
                'in:new,contacted,qualified,meeting_booked,proposal_sent,won,lost',
            ],
        ]);

        $oldStage = $lead->stage;
        $newStage = $data['stage'];

        if ($oldStage === $newStage) {
            return response()->json([
                'message' => 'Lead is already in this stage.',
                'data' => $lead,
            ]);
        }

        DB::transaction(function () use (
            $lead,
            $oldStage,
            $newStage
        ) {
            $lead->update([
                'stage' => $newStage,
            ]);

            LeadStageHistory::create([
                'lead_id' => $lead->id,
                'from_stage' => $oldStage,
                'to_stage' => $newStage,
                'changed_by' => auth()->id(),
            ]);

            LeadActivity::create([
                'lead_id' => $lead->id,
                'type' => 'stage_changed',
                'description' => "Stage changed from {$oldStage} to {$newStage}.",
                'user_id' => auth()->id(),
            ]);
        });

        $updatedLead = $lead->fresh();

        ActivityLogger::log(
            'stage_changed',
            'leads',
            $updatedLead,
            [
                'stage' => $oldStage,
            ],
            [
                'stage' => $newStage,
            ]
        );

        return response()->json([
            'message' => 'Lead stage updated successfully.',
            'data' => $updatedLead,
        ]);
    }

    /**
     * Add activity to lead.
     */
    public function addActivity(Request $request, Lead $lead)
    {
        $data = $request->validate([
            'type' => [
                'required',
                'string',
                'max:100',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $activity = $lead->activities()->create([
            'type' => $data['type'],
            'description' => $data['description'] ?? null,
            'user_id' => auth()->id(),
        ]);

        ActivityLogger::log(
            'activity_added',
            'leads',
            $lead,
            null,
            [
                'activity_id' => $activity->id,
                'type' => $activity->type,
                'description' => $activity->description,
            ]
        );

        return response()->json([
            'message' => 'Lead activity added successfully.',
            'data' => $activity,
        ], 201);
    }

    /**
     * Record WhatsApp engagement.
     */
    public function whatsapp(Lead $lead)
    {
        $oldValues = [
            'whatsapp_clicked_at' => $lead->whatsapp_clicked_at,
        ];

        $lead->update([
            'whatsapp_clicked_at' => now(),
        ]);

        $activity = $lead->activities()->create([
            'type' => 'whatsapp_click',
            'description' => 'WhatsApp engagement recorded.',
            'user_id' => auth()->id(),
        ]);

        $updatedLead = $lead->fresh();

        ActivityLogger::log(
            'whatsapp_clicked',
            'leads',
            $updatedLead,
            $oldValues,
            [
                'whatsapp_clicked_at' => $updatedLead->whatsapp_clicked_at,
                'activity_id' => $activity->id,
            ]
        );

        return response()->json([
            'message' => 'WhatsApp engagement recorded successfully.',
            'data' => $updatedLead,
            'activity' => $activity,
        ]);
    }

    /**
     * Soft delete lead.
     */
    public function destroy(Lead $lead)
    {
        $oldValues = $lead->load([
            'activities',
            'stageHistories',
        ])->toArray();

        $lead->delete();

        ActivityLogger::log(
            'deleted',
            'leads',
            $lead,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Lead deleted successfully.',
        ]);
    }
}
