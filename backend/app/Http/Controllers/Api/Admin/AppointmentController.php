<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Appointments
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $query = Appointment::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate(
                'appointment_date',
                $request->date
            );
        }

        if ($request->filled('meeting_type')) {
            $query->where(
                'meeting_type',
                $request->meeting_type
            );
        }

        if ($request->filled('time_preference')) {
            $query->where(
                'time_preference',
                $request->time_preference
            );
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query
                ->orderByDesc('appointment_date')
                ->orderByDesc('appointment_time')
                ->paginate(20)
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Show
    |--------------------------------------------------------------------------
    */

    public function show(Appointment $appointment)
    {
        return response()->json($appointment);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Appointment - Admin
    |--------------------------------------------------------------------------
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
                'required',
                'email',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'service' => [
                'nullable',
                'string',
                'max:255',
            ],

            'appointment_date' => [
                'required',
                'date',
            ],

            'appointment_time' => [
                'required',
                'date_format:H:i',
            ],

            'time_preference' => [
                'nullable',
                'in:morning,afternoon,evening',
            ],

            'meeting_type' => [
                'required',
                'in:google_meet,whatsapp,phone',
            ],

            'message' => [
                'nullable',
                'string',
            ],

            'status' => [
                'nullable',
                'in:pending,confirmed,rescheduled,completed,cancelled,no_show',
            ],

            'admin_notes' => [
                'nullable',
                'string',
            ],

            'meeting_link' => [
                'nullable',
                'url',
                'max:500',
            ],
        ]);

        $exists = Appointment::query()
            ->whereDate(
                'appointment_date',
                $data['appointment_date']
            )
            ->where(
                'appointment_time',
                $data['appointment_time']
            )
            ->whereIn('status', [
                'pending',
                'confirmed',
                'rescheduled',
            ])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This appointment time is already booked.',
            ], 422);
        }

        $appointment = DB::transaction(function () use ($data) {
            $appointment = Appointment::create([
                ...$data,
                'status' => $data['status'] ?? 'pending',
            ]);

            ActivityLogger::log(
                'created',
                'appointments',
                $appointment,
                null,
                $appointment->toArray()
            );

            return $appointment;
        });

        return response()->json(
            $appointment,
            201
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Appointment
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Appointment $appointment
    ) {
        $data = $request->validate([
            'status' => [
                'sometimes',
                'required',
                'in:pending,confirmed,rescheduled,completed,cancelled,no_show',
            ],

            'appointment_date' => [
                'sometimes',
                'required',
                'date',
            ],

            'appointment_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'time_preference' => [
                'nullable',
                'in:morning,afternoon,evening',
            ],

            'meeting_type' => [
                'sometimes',
                'required',
                'in:google_meet,whatsapp,phone',
            ],

            'service' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'message' => [
                'nullable',
                'string',
            ],

            'admin_notes' => [
                'nullable',
                'string',
            ],

            'meeting_link' => [
                'nullable',
                'url',
                'max:500',
            ],
        ]);

        $oldValues = $appointment->toArray();

        /*
        |--------------------------------------------------------------------------
        | Check New Slot
        |--------------------------------------------------------------------------
        */

        if (
            isset($data['appointment_date']) ||
            isset($data['appointment_time'])
        ) {
            $date = $data['appointment_date']
                ?? $appointment->appointment_date;

            $time = $data['appointment_time']
                ?? $appointment->appointment_time;

            $exists = Appointment::query()
                ->whereDate('appointment_date', $date)
                ->where('appointment_time', $time)
                ->where('id', '!=', $appointment->id)
                ->whereIn('status', [
                    'pending',
                    'confirmed',
                    'rescheduled',
                ])
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This appointment time is already booked.',
                ], 422);
            }
        }

        DB::transaction(function () use (
            $appointment,
            $data,
            $oldValues
        ) {
            $appointment->update($data);

            ActivityLogger::log(
                'updated',
                'appointments',
                $appointment,
                $oldValues,
                $appointment->fresh()->toArray()
            );
        });

        return response()->json(
            $appointment->fresh()
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function destroy(Appointment $appointment)
    {
        $oldValues = $appointment->toArray();

        $appointment->delete();

        ActivityLogger::log(
            'deleted',
            'appointments',
            $appointment,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Appointment deleted successfully.',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Availability
    |--------------------------------------------------------------------------
    */

    public function availability()
    {
        return response()->json(
            AvailabilitySlot::query()
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get()
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Availability
    |--------------------------------------------------------------------------
    */

    public function storeAvailability(Request $request)
    {
        $data = $request->validate([
            'day_of_week' => [
                'required',
                'integer',
                'between:0,6',
            ],

            'start_time' => [
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],

            'slot_duration' => [
                'required',
                'integer',
                'min:15',
                'max:240',
            ],

            'buffer_time' => [
                'nullable',
                'integer',
                'min:0',
                'max:120',
            ],

            'is_available' => [
                'nullable',
                'boolean',
            ],
        ]);

        $slot = AvailabilitySlot::create([
            ...$data,
            'buffer_time' => $data['buffer_time'] ?? 0,
            'is_available' => $data['is_available'] ?? true,
        ]);

        ActivityLogger::log(
            'created',
            'availability',
            $slot,
            null,
            $slot->toArray()
        );

        return response()->json(
            $slot,
            201
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Availability
    |--------------------------------------------------------------------------
    */

    public function updateAvailability(
        Request $request,
        AvailabilitySlot $availabilitySlot
    ) {
        $data = $request->validate([
            'day_of_week' => [
                'sometimes',
                'required',
                'integer',
                'between:0,6',
            ],

            'start_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'slot_duration' => [
                'sometimes',
                'required',
                'integer',
                'min:15',
                'max:240',
            ],

            'buffer_time' => [
                'nullable',
                'integer',
                'min:0',
                'max:120',
            ],

            'is_available' => [
                'nullable',
                'boolean',
            ],
        ]);

        $oldValues = $availabilitySlot->toArray();

        $availabilitySlot->update($data);

        ActivityLogger::log(
            'updated',
            'availability',
            $availabilitySlot,
            $oldValues,
            $availabilitySlot->fresh()->toArray()
        );

        return response()->json(
            $availabilitySlot->fresh()
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Availability
    |--------------------------------------------------------------------------
    */

    public function destroyAvailability(
        AvailabilitySlot $availabilitySlot
    ) {
        $oldValues = $availabilitySlot->toArray();

        $availabilitySlot->delete();

        ActivityLogger::log(
            'deleted',
            'availability',
            $availabilitySlot,
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Availability slot deleted successfully.',
        ]);
    }
}