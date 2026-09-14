<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('title')->after('slug');
            $table->string('short_description')->nullable()->after('title');
            $table->longText('description')->nullable()->after('short_description');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'short_description',
                'description',
            ]);
        });
    }
};