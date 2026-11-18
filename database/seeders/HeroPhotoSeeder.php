<?php
// database/seeders/HeroPhotoSeeder.php

namespace Database\Seeders;

use App\Models\HeroPhoto;
use Illuminate\Database\Seeder;

class HeroPhotoSeeder extends Seeder
{
    public function run(): void
    {
        $base = 'https://images.unsplash.com/';
        $query = '&auto=format&fit=crop&q=80';

        $rows = [
            [1, $base . 'photo-1523240795612-9a054b0db644?w=1200' . $query, 'Mahasiswa berdiskusi di kampus'],
            [2, $base . 'photo-1532094349884-543bc11b234d?w=700' . $query,  'Praktikum di laboratorium'],
            [3, $base . 'photo-1522202176988-66273c2fd55f?w=700' . $query,  'Mahasiswa belajar kelompok'],
            [4, $base . 'photo-1581091226825-a6a2a5aee158?w=900' . $query,  'Mahasiswa memakai peralatan laboratorium'],
        ];

        foreach ($rows as [$posisi, $gambar, $alt]) {
            HeroPhoto::updateOrCreate(
                ['posisi' => $posisi],
                ['gambar' => $gambar, 'alt' => $alt, 'is_active' => true],
            );
        }
    }
}
