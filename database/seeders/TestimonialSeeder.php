<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $img = fn (string $id) => "https://images.unsplash.com/{$id}?auto=format&fit=crop&w=300&q=80";

        $rows = [
            ['name' => 'Rina Maharani',  'batch' => 'Angkatan 2017', 'job' => 'Software Engineer', 'company' => 'Perusahaan Teknologi Nasional', 'photo' => $img('photo-1494790108377-be9c29b29330'), 'quote' => 'Proyek akhir saya dikerjakan bersama perusahaan mitra fakultas. Dua minggu setelah sidang, saya sudah ditawari kerja di sana.'],
            ['name' => 'Dimas Prakoso',  'batch' => 'Angkatan 2015', 'job' => 'Production Manager', 'company' => 'Manufaktur Mandiri',          'photo' => $img('photo-1500648767791-00dcc994a43e'), 'quote' => 'Praktikum di laboratorium membuat saya terbiasa memakai alat yang sama dengan yang ada di pabrik.'],
            ['name' => 'Sari Wulandari', 'batch' => 'Angkatan 2019', 'job' => 'Founder',            'company' => 'Startup Agritech',             'photo' => $img('photo-1438761681033-6461ffad8d80'), 'quote' => 'Dosen pembimbing membantu saya mengubah tugas akhir menjadi usaha rintisan. Sekarang kami melayani 300 petani.'],
        ];

        foreach ($rows as $i => $row) {
            Testimonial::updateOrCreate(['name' => $row['name']], $row + ['sort_order' => $i + 1]);
        }
    }
}
