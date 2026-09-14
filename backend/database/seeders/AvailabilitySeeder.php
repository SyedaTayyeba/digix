<?php

namespace Database\Seeders;

use App\Models\AvailabilitySlot;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $schedule = [
            // Sunday
            [
                'day_of_week' => 0,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ],

            // Monday
            [
                'day_of_week' => 1,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ],

            // Tuesday
            [
                'day_of_week' => 2,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ],

            // Wednesday
            [
                'day_of_week' => 3,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ],

            // Thursday
            [
                'day_of_week' => 4,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ],
        ];

        foreach ($schedule as $slot) {
            AvailabilitySlot::updateOrCreate(
                [
                    'day_of_week' => $slot['day_of_week'],
                    'start_time' => $slot['start_time'],
                    'end_time' => $slot['end_time'],
                ],
                [
                    'slot_duration' => 30,
                    'buffer_time' => 0,
                    'is_available' => true,
                ]
            );
        }
    }
}
