<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guest_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('riad_id')->constrained()->onDelete('cascade');
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            
            // Crucial for the Sticky Token Defense and stay tracking
            $table->string('session_id'); 
            
            // 'menu', 'service', 'excursion'
            $table->string('type'); 
            $table->unsignedBigInteger('item_id'); 
            
            // Flexible quantity (Defaults to 1)
            $table->integer('quantity')->default(1);
            
            // Custom guest notes or instructions
            $table->text('notes')->nullable(); 
            
            // Operational state: pending, completed, cancelled, etc.
            $table->string('status')->default('pending'); 
            $table->timestamps();

            // Indexes for fast querying on the Live Desk
            $table->index(['riad_id', 'status']);
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_requests');
    }
};