<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['slug' => 'teknik-informatika', 'name' => 'Teknik Informatika', 'degree' => 'S1', 'accreditation' => 'Unggul',       'student_count' => 820, 'description' => 'Pemrograman, kecerdasan buatan, dan rekayasa perangkat lunak lewat proyek bersama perusahaan teknologi.'],
            ['slug' => 'teknik-elektro',     'name' => 'Teknik Elektro',     'degree' => 'S1', 'accreditation' => 'Baik Sekali',  'student_count' => 540, 'description' => 'Sistem tenaga, elektronika, dan otomasi industri dengan praktikum di laboratorium sendiri.'],
            ['slug' => 'teknik-industri',    'name' => 'Teknik Industri',    'degree' => 'S1', 'accreditation' => 'Unggul',       'student_count' => 610, 'description' => 'Perancangan sistem produksi, logistik, dan manajemen mutu untuk pabrik dan layanan.'],
            ['slug' => 'sistem-informasi',   'name' => 'Sistem Informasi',   'degree' => 'S1', 'accreditation' => 'Baik Sekali',  'student_count' => 700, 'description' => 'Analisis data dan sistem bisnis digital untuk organisasi yang sedang bertransformasi.'],
            ['slug' => 'kimia-terapan',      'name' => 'Kimia Terapan',      'degree' => 'D4', 'accreditation' => 'Baik',         'student_count' => 280, 'description' => 'Analisis kimia dan pengolahan material dengan standar laboratorium industri.'],
            ['slug' => 'teknik-sipil',       'name' => 'Teknik Sipil',       'degree' => 'S1', 'accreditation' => 'Baik Sekali',  'student_count' => 450, 'description' => 'Perencanaan struktur, konstruksi, dan infrastruktur dengan praktik lapangan bersama kontraktor.'],
            ['slug' => 'matematika',         'name' => 'Matematika',         'degree' => 'S1', 'accreditation' => 'Baik',         'student_count' => 210, 'description' => 'Pemodelan, statistika, dan komputasi sains sebagai dasar riset dan analisis data.'],
            ['slug' => 'magister-teknik',    'name' => 'Magister Teknik',    'degree' => 'S2', 'accreditation' => 'Baik Sekali',  'student_count' => 140, 'description' => 'Riset lanjutan untuk profesional yang ingin memimpin inovasi di bidangnya.'],
        ];

        foreach ($rows as $i => $row) {
            Program::updateOrCreate(['slug' => $row['slug']], $row + ['sort_order' => $i + 1]);
        }
    }
}
