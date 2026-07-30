<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guest_requests', function (Blueprint $table) {
            $table->decimal('unit_price', 10, 2)->nullable()->after('item_id');
            $table->decimal('total_price', 10, 2)->nullable()->after('quantity');
            $table->string('item_name')->nullable()->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('guest_requests', function (Blueprint $table) {
            $table->dropColumn(['unit_price', 'total_price', 'item_name']);
        });
    }
};
