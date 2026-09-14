<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('conversion_events', function (Blueprint $table) {
    $table->id();

    $table->string('event_name');
    $table->string('source')->nullable();

    $table->string('session_id')->nullable();
    $table->string('page_url')->nullable();

    $table->json('metadata')->nullable();

    $table->timestamp('occurred_at')->nullable();

    $table->timestamps();

    $table->index('event_name');
    $table->index('source');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversion_events');
    }
};
