<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guest_requests', function (Blueprint $table) {
            $table->index('completed_at');
            $table->index('type');
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->index('status');
            $table->index('qr_token');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['riad_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('guest_requests', function (Blueprint $table) {
            $table->dropIndex(['completed_at']);
            $table->dropIndex(['type']);
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['qr_token']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['riad_id', 'created_at']);
        });
    }
};
