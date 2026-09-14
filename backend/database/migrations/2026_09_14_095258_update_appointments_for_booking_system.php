<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('time_preference')
                ->nullable()
                ->after('appointment_time');

            $table->string('meeting_type')
                ->default('google_meet')
                ->after('time_preference');

            $table->text('admin_notes')
                ->nullable()
                ->after('message');

            $table->string('meeting_link')
                ->nullable()
                ->after('admin_notes');

            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'time_preference',
                'meeting_type',
                'admin_notes',
                'meeting_link',
            ]);

            $table->dropSoftDeletes();
        });
    }
};