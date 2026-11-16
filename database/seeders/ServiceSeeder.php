<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['title' => 'Perpustakaan digital', 'url' => '/layanan/perpustakaan',   'icon' => 'book',       'description' => 'Akses jurnal, e-book, dan skripsi dari mana saja.'],
            ['title' => 'Peminjaman laboratorium', 'url' => '/layanan/laboratorium', 'icon' => 'flask',      'description' => 'Ajukan jadwal dan alat praktikum secara daring.'],
            ['title' => 'Magang dan karier', 'url' => '/layanan/karier',      'icon' => 'handshake',  'description' => 'Lowongan magang, bursa kerja, dan konsultasi karier.'],
            ['title' => 'Layanan akademik', 'url' => '/layanan/akademik',       'icon' => 'graduation', 'description' => 'KRS, transkrip, surat keterangan, dan cuti akademik.'],
            ['title' => 'Riset dan pengabdian', 'url' => '/layanan/riset',   'icon' => 'microscope', 'description' => 'Pendaftaran hibah, etika penelitian, dan publikasi.'],
            ['title' => 'Layanan alumni',         'url' => '/layanan/alumni',  'icon' => 'graduation', 'description' => 'Legalisir ijazah, pelacakan alumni, dan jejaring lulusan.'],
            ['title' => 'Pusat bahasa',           'url' => '/layanan/bahasa',  'icon' => 'book',       'description' => 'Kursus bahasa Inggris dan tes kemampuan bahasa.'],
            ['title' => 'Kemahasiswaan', 'url' => '/layanan/kemahasiswaan',          'icon' => 'users',      'description' => 'Beasiswa, organisasi, dan konseling mahasiswa.'],
        ];

        foreach ($rows as $i => $row) {
            Service::updateOrCreate(['title' => $row['title']], $row + ['sort_order' => $i + 1]);
        }
    }
}
