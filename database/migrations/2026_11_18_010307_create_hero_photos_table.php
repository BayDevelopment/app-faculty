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
        Schema::create('hero_photos', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('posisi')->unique(); // 1 = besar kiri, 2 = kanan atas, 3 = kanan tengah, 4 = bawah lebar
            $table->string('gambar');                        // path storage atau URL
            $table->string('alt')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_photos');
    }
};
