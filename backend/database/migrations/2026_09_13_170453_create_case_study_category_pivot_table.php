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
      Schema::create('case_study_category', function (Blueprint $table) {
    $table->foreignId('case_study_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('case_study_category_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->primary([
        'case_study_id',
        'case_study_category_id'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_study_category_pivot');
    }
};
