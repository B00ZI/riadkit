<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('riad_id')->constrained()->onDelete('cascade');
            // Optional category relation if they want to group services (e.g., "Wellness")
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name'); // e.g., "Extra Towels", "Laundry Service"
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->nullable(); // Some services might be free
            $table->boolean('is_available')->default(true);
            $table->boolean('requires_quantity')->default(false); // e.g. "How many towels?"
            $table->timestamps();

            $table->index('riad_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};