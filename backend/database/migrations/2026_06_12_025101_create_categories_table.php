<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('riad_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['menu', 'service'])->default('menu'); // Differentiates food/drinks from hotel services
            $table->integer('sort_order')->default(0); // For custom ordering in UI
            $table->timestamps();

            // Indexing for performance and multi-tenant querying
            $table->index(['riad_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};