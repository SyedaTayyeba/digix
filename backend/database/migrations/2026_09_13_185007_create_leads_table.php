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
      Schema::create('leads', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->nullable();
    $table->string('phone')->nullable();
    $table->string('company')->nullable();
    $table->string('source')->nullable();
    $table->string('stage')->default('new');
    $table->decimal('estimated_value', 15, 2)->nullable();
    $table->text('message')->nullable();
    $table->json('form_data')->nullable();
    $table->timestamp('whatsapp_clicked_at')->nullable();
    $table->softDeletes();
    $table->timestamps();

    $table->index('stage');
    $table->index('source');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
