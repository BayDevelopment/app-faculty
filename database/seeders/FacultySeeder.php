<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        Faculty::updateOrCreate(['id' => 1], [
            'name'        => 'Fakultas Teknik dan Sains',
            'university'  => 'Universitas Contoh Nusantara',
            'tagline'     => 'Belajar di laboratorium, bekerja bersama industri, lulus siap berkarya.',
            'description' => 'Kami mendidik mahasiswa lewat praktikum nyata, magang terstruktur, dan proyek bersama mitra industri, sehingga lulusan langsung paham dunia kerja.',
            'hero_image'  => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
            'vision'      => 'Menjadi fakultas unggul di Asia Tenggara dalam pendidikan, riset terapan, dan kerja sama industri pada tahun 2035.',
            'missions'    => [
                'Menyelenggarakan pembelajaran berbasis proyek dan praktik laboratorium yang relevan dengan kebutuhan industri.',
                'Mengembangkan riset terapan yang hasilnya dipakai masyarakat dan dunia usaha.',
                'Memperluas kerja sama dengan mitra industri, pemerintah, dan perguruan tinggi, di dalam maupun luar negeri.',
                'Membangun budaya akademik yang jujur, inklusif, dan mendorong mahasiswa berwirausaha.',
            ],
            'address'     => 'Jl. Pendidikan No. 1, Serang, Banten 42111',
            'email'       => 'fakultas@universitas.ac.id',
            'phone'       => '(0254) 123 456',
        ]);
    }
}
