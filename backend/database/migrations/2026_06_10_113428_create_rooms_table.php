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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();

            // The "Foreign Key" link
            $table->foreignId('riad_id')->constrained()->onDelete('cascade');

            $table->string('room_number');
            $table->string('type'); // e.g., "Suite", "Standard"
            $table->string('qr_token'); // The secret code for the QR link
            $table->string('status')->default('available');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
