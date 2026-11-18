<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FacultySeeder::class,
            HeroPhotoSeeder::class,
            StatSeeder::class,
            ProgramSeeder::class,
            ServiceSeeder::class,
            NewsSeeder::class,
            TestimonialSeeder::class,
        ]);
    }
}
