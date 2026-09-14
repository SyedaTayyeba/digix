<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadStageHistory;
use App\Models\User;
use App\Notifications\NewLeadNotification;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicLeadController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:50',
            ],

            'company' => [
                'nullable',
                'string',
                'max:255',
            ],

            'message' => [
                'nullable',
                'string',
            ],

            'source' => [
                'nullable',
                'string',
                'max:100',
            ],

            'form_data' => [
                'nullable',
                'array',
            ],
        ]);

        $data['source'] = $data['source'] ?? 'contact_form';
        $data['stage'] = 'new';

        $lead = DB::transaction(function () use ($data) {
            $lead = Lead::create($data);

            LeadStageHistory::create([
                'lead_id' => $lead->id,
                'from_stage' => null,
                'to_stage' => 'new',
                'changed_by' => null,
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

        User::whereHas('roles', function ($query) {
            $query->where('slug', 'super-admin');
        })
            ->get()
            ->each(function ($admin) use ($lead) {
                $admin->notify(
                    new NewLeadNotification($lead)
                );
            });

        return response()->json([
            'message' => 'Your enquiry has been submitted successfully.',
            'data' => $lead,
        ], 201);
    }
    public function whatsapp(Request $request, Lead $lead)
    {
        $oldValues = $lead->toArray();

        $lead->update([
            'whatsapp_clicked_at' => now(),
        ]);

        $lead->activities()->create([
            'type' => 'whatsapp_click',
            'description' => 'Lead clicked WhatsApp contact.',
            'user_id' => null,
        ]);

        ActivityLogger::log(
            'whatsapp_clicked',
            'leads',
            $lead,
            $oldValues,
            $lead->fresh()->toArray()
        );

        return response()->json([
            'message' => 'WhatsApp engagement tracked successfully.',
            'data' => [
                'lead_id' => $lead->id,
                'whatsapp_clicked_at' => $lead->fresh()->whatsapp_clicked_at,
            ],
        ]);
    }
}
