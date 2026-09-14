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
       Schema::create('pricing_packages', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->decimal('price', 12, 2)->nullable();
    $table->string('currency', 10)->default('USD');
    $table->string('billing_period')->nullable();
    $table->text('description')->nullable();
    $table->boolean('is_featured')->default(false);
    $table->string('status')->default('draft');
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
        Schema::dropIfExists('pricing_packages');
    }
};
