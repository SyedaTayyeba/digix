<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    /**
     * Get available appointment slots for a selected date.
     */
    public function availability(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time_preference' => [
                'nullable',
                'in:morning,afternoon,evening',
            ],
        ]);

        $date = Carbon::parse($validated['date']);

        $dayOfWeek = $date->dayOfWeek;

        $slots = AvailabilitySlot::where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->orderBy('start_time')
            ->get();

        $bookedTimes = Appointment::whereDate(
            'appointment_date',
            $date->toDateString()
        )
            ->whereIn('status', [
                'pending',
                'confirmed',
                'rescheduled',
            ])
            ->pluck('appointment_time')
            ->map(fn ($time) => Carbon::parse($time)->format('H:i'))
            ->toArray();

        $availableSlots = [];

        foreach ($slots as $slot) {
            $start = Carbon::parse($slot->start_time);
            $end = Carbon::parse($slot->end_time);

            $duration = (int) ($slot->slot_duration ?: 30);
            $buffer = (int) ($slot->buffer_time ?: 0);

            while ($start->copy()->addMinutes($duration)->lte($end)) {
                $time = $start->format('H:i');

                if (!in_array($time, $bookedTimes, true)) {
                    $preference = $this->getTimePreference(
                        $start->hour
                    );

                    if (
                        empty($validated['time_preference']) ||
                        $validated['time_preference'] === $preference
                    ) {
                        $availableSlots[] = [
                            'time' => $time,
                            'display_time' => $start->format('g:i A'),
                            'time_preference' => $preference,
                        ];
                    }
                }

                $start->addMinutes($duration + $buffer);
            }
        }

        return response()->json([
            'date' => $date->toDateString(),
            'day_of_week' => $dayOfWeek,
            'slots' => $availableSlots,
        ]);
    }

    /**
     * Create a public appointment booking.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'service' => ['nullable', 'string', 'max:255'],

            'appointment_date' => [
                'required',
                'date',
                'after_or_equal:today',
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

            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        $date = Carbon::parse($validated['appointment_date']);

        /*
        |--------------------------------------------------------------------------
        | Check working hours / availability
        |--------------------------------------------------------------------------
        */

        $dayOfWeek = $date->dayOfWeek;

        $time = Carbon::createFromFormat(
            'H:i',
            $validated['appointment_time']
        );

        $slot = AvailabilitySlot::where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->whereTime('start_time', '<=', $time->format('H:i:s'))
            ->whereTime(
                'end_time',
                '>=',
                $time->copy()->addMinutes(1)->format('H:i:s')
            )
            ->first();

        if (!$slot) {
            return response()->json([
                'message' => 'This appointment time is not available.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Check duplicate booking
        |--------------------------------------------------------------------------
        */

        $exists = Appointment::whereDate(
            'appointment_date',
            $date->toDateString()
        )
            ->whereTime(
                'appointment_time',
                $time->format('H:i:s')
            )
            ->whereIn('status', [
                'pending',
                'confirmed',
                'rescheduled',
            ])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This appointment slot is already booked.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Create appointment
        |--------------------------------------------------------------------------
        */

        $appointment = DB::transaction(function () use ($validated) {
            return Appointment::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'service' => $validated['service'] ?? null,

                'appointment_date' =>
                    $validated['appointment_date'],

                'appointment_time' =>
                    $validated['appointment_time'],

                'time_preference' =>
                    $validated['time_preference'] ?? null,

                'meeting_type' =>
                    $validated['meeting_type'],

                'message' =>
                    $validated['message'] ?? null,

                'status' => 'pending',
            ]);
        });

        return response()->json([
            'message' =>
                'Your consultation has been booked successfully.',

            'data' => $appointment,
        ], 201);
    }

    private function getTimePreference(int $hour): string
    {
        if ($hour < 12) {
            return 'morning';
        }

        if ($hour < 17) {
            return 'afternoon';
        }

        return 'evening';
    }
}