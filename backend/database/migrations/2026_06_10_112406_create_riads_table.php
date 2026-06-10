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
        Schema::create('riads', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->string('name');
            $table->string('subdomain')->nullable(); // Optional for later SaaS growth
            $table->string('logoUrl')->nullable();
            $table->text('description')->nullable();
            $table->string('wifiName')->nullable();
            $table->string('wifiPassword')->nullable();
            $table->string('whatsappNumber');
            $table->string('currency')->default('MAD'); // Default to Moroccan Dirhams
            $table->string('instagramUrl')->nullable();
            $table->timestamps(); // Handles createdAt and updatedAt automatically
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('riad_id')->references('id')->on('riads')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riads');
    }
};
