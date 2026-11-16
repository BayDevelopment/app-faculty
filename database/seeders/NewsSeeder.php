<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $img = fn (string $id) => "https://images.unsplash.com/{$id}?auto=format&fit=crop&w=1200&q=80";

        $rows = [
            [
                'slug' => 'kerja-sama-industri-baru',
                'title' => 'Fakultas menandatangani kerja sama dengan 12 mitra industri baru',
                'excerpt' => 'Kerja sama mencakup magang bersertifikat, kelas tamu, dan riset terapan bersama.',
                'category' => 'Kerja sama',
                'image' => $img('photo-1521737604893-d14cc237f11d'),
                'published_at' => '2026-11-10',
            ],
            [
                'slug' => 'juara-kompetisi-nasional',
                'title' => 'Tim mahasiswa meraih juara pertama kompetisi robotika nasional',
                'excerpt' => 'Tim beranggotakan lima mahasiswa Teknik Elektro menyingkirkan 64 peserta dari seluruh Indonesia.',
                'category' => 'Prestasi',
                'image' => $img('photo-1485827404703-89b55fcc595e'),
                'published_at' => '2026-11-04',
            ],
            [
                'slug' => 'laboratorium-baru',
                'title' => 'Laboratorium kecerdasan buatan resmi dibuka untuk mahasiswa',
                'excerpt' => 'Laboratorium dilengkapi 40 stasiun kerja GPU dan dapat dipakai untuk tugas akhir.',
                'category' => 'Fasilitas',
                'image' => $img('photo-1581092918056-0c4c3acd3789'),
                'published_at' => '2026-10-28',
            ],
        ];

        foreach ($rows as $row) {
            News::updateOrCreate(
                ['slug' => $row['slug']],
                $row + ['content' => $row['excerpt'], 'is_published' => true],
            );
        }
    }
}
