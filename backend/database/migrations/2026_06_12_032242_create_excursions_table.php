<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('excursions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('riad_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2); // Price per person or group
            $table->string('duration')->nullable(); // e.g., "Half Day", "Full Day", "2 hours"
            $table->string('image_url')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->index('riad_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('excursions');
    }
};