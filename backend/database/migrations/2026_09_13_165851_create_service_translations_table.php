<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_translations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('service_id')
                ->constrained('services')
                ->cascadeOnDelete();

            $table->string('locale', 5);

            $table->string('title');
            $table->string('short_description')->nullable();
            $table->longText('description')->nullable();

            $table->unique(['service_id', 'locale']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_translations');
    }
};