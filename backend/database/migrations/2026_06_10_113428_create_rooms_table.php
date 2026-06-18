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
            $table->string('type'); 
            $table->string('qr_token'); 
            $table->string('status')->default('vacant'); // 'vacant' or 'occupied'

            // For guest session management
            $table->string('current_session_id')->nullable();
            $table->enum('session_status', ['active', 'expired'])->default('expired');
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
