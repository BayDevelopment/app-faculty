<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->string('hero_image')->nullable()->after('description');
            $table->text('overview')->nullable()->after('hero_image');
            $table->text('vision')->nullable()->after('overview');
            $table->string('duration', 30)->nullable()->after('vision');
            $table->unsignedSmallInteger('credits')->nullable()->after('duration');

            $table->string('head_name')->nullable()->after('credits');
            $table->string('head_title')->nullable()->after('head_name');
            $table->string('head_photo')->nullable()->after('head_title');

            $table->json('competencies')->nullable();
            $table->json('curriculum')->nullable();
            $table->json('career_prospects')->nullable();
            $table->json('facilities')->nullable();
            $table->json('admission_requirements')->nullable();

            $table->string('contact_email')->nullable();
            $table->string('contact_phone', 30)->nullable();
        });
    }

    public function down(): void
    {
        $columns = array_filter([
            'hero_image',
            'overview',
            'vision',
            'duration',
            'credits',
            'head_name',
            'head_title',
            'head_photo',
            'competencies',
            'curriculum',
            'career_prospects',
            'facilities',
            'admission_requirements',
            'contact_email',
            'contact_phone',
        ], fn(string $column) => Schema::hasColumn('programs', $column));

        if ($columns) {
            Schema::table('programs', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};
