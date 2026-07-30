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
        Schema::table('riads', function (Blueprint $table) {
            $table->string('logo_url')->nullable()->after('logoUrl');
            $table->string('logo_public_id')->nullable()->after('logo_url');
            $table->string('cover_image_url')->nullable()->after('logo_public_id');
            $table->string('cover_image_public_id')->nullable()->after('cover_image_url');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('image_public_id')->nullable()->after('image_url');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('name');
            $table->string('image_public_id')->nullable()->after('image_url');
        });

        Schema::table('excursions', function (Blueprint $table) {
            $table->string('image_public_id')->nullable()->after('image_url');
        });
    }

    public function down(): void
    {
        Schema::table('riads', function (Blueprint $table) {
            $table->dropColumn(['logo_url', 'logo_public_id', 'cover_image_url', 'cover_image_public_id']);
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('image_public_id');
        });

        Schema::table('excursions', function (Blueprint $table) {
            $table->dropColumn('image_public_id');
        });
    }
};
