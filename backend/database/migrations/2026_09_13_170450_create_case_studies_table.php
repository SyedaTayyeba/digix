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
       Schema::create('case_studies', function (Blueprint $table) {
    $table->id();
    $table->string('slug')->unique();
    $table->string('status')->default('draft');
    $table->string('client_name')->nullable();
    $table->string('project_url')->nullable();
    $table->string('featured_image')->nullable();
    $table->integer('sort_order')->default(0);
    $table->softDeletes();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }
};
