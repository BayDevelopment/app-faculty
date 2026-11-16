<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $img = fn(string $id) => "https://images.unsplash.com/{$id}?auto=format&fit=crop&w=1200&q=80";

        $photos = [
            $img('photo-1521737604893-d14cc237f11d'),
            $img('photo-1485827404703-89b55fcc595e'),
            $img('photo-1581092918056-0c4c3acd3789'),
        ];

        $rows = [
            [
                'slug' => 'kerja-sama-industri-baru',
                'title' => 'Fakultas menandatangani kerja sama dengan 12 mitra industri baru',
                'excerpt' => 'Kerja sama mencakup magang bersertifikat, kelas tamu, dan riset terapan bersama.',
                'category' => 'Kerja sama',
                'image' => $photos[0],
                'published_at' => '2026-11-10',
            ],
            [
                'slug' => 'juara-kompetisi-nasional',
                'title' => 'Tim mahasiswa meraih juara pertama kompetisi robotika nasional',
                'excerpt' => 'Tim beranggotakan lima mahasiswa Teknik Elektro menyingkirkan 64 peserta dari seluruh Indonesia.',
                'category' => 'Prestasi',
                'image' => $photos[1],
                'published_at' => '2026-11-04',
            ],
            [
                'slug' => 'laboratorium-baru',
                'title' => 'Laboratorium kecerdasan buatan resmi dibuka untuk mahasiswa',
                'excerpt' => 'Laboratorium dilengkapi 40 stasiun kerja GPU dan dapat dipakai untuk tugas akhir.',
                'category' => 'Fasilitas',
                'image' => $photos[2],
                'published_at' => '2026-10-28',
            ],
            [
                'slug' => 'kalender-akademik-semester-genap',
                'title' => 'Kalender akademik semester genap 2026/2027 resmi dirilis',
                'excerpt' => 'Jadwal registrasi, perkuliahan, hingga ujian akhir semester kini dapat diunduh di portal akademik.',
                'category' => 'Akademik',
                'image' => $photos[0],
                'published_at' => '2026-10-25',
            ],
            [
                'slug' => 'hibah-penelitian-dosen',
                'title' => 'Sembilan proposal dosen lolos pendanaan hibah penelitian nasional',
                'excerpt' => 'Penelitian mencakup energi terbarukan, material maju, dan sistem cerdas untuk industri.',
                'category' => 'Penelitian',
                'image' => $photos[1],
                'published_at' => '2026-10-20',
            ],
            [
                'slug' => 'pembukaan-beasiswa-prestasi',
                'title' => 'Pendaftaran beasiswa prestasi dibuka hingga akhir bulan',
                'excerpt' => 'Beasiswa mencakup potongan biaya kuliah dan tunjangan riset untuk mahasiswa berprestasi.',
                'category' => 'Beasiswa',
                'image' => $photos[2],
                'published_at' => '2026-10-17',
            ],
            [
                'slug' => 'himpunan-mahasiswa-bakti-sosial',
                'title' => 'Himpunan mahasiswa gelar bakti sosial dan pelatihan komputer untuk warga',
                'excerpt' => 'Puluhan mahasiswa turun langsung mengajar literasi digital di desa binaan fakultas.',
                'category' => 'Kegiatan Mahasiswa',
                'image' => $photos[0],
                'published_at' => '2026-10-14',
            ],
            [
                'slug' => 'pengabdian-instalasi-listrik-surya',
                'title' => 'Dosen dan mahasiswa memasang panel surya untuk sekolah di daerah terpencil',
                'excerpt' => 'Program pengabdian ini menerangi tiga ruang kelas dan satu perpustakaan sekolah dasar.',
                'category' => 'Pengabdian Masyarakat',
                'image' => $photos[1],
                'published_at' => '2026-10-10',
            ],
            [
                'slug' => 'seminar-nasional-teknologi',
                'title' => 'Seminar nasional teknologi dan sains hadirkan pembicara dari lima negara',
                'excerpt' => 'Lebih dari 300 peserta mengikuti sesi paralel tentang transformasi digital dan keberlanjutan.',
                'category' => 'Seminar & Workshop',
                'image' => $photos[2],
                'published_at' => '2026-10-06',
            ],
            [
                'slug' => 'pengumuman-jadwal-wisuda',
                'title' => 'Pengumuman jadwal dan tata tertib wisuda periode ini',
                'excerpt' => 'Wisudawan diminta melengkapi berkas administrasi paling lambat satu minggu sebelum acara.',
                'category' => 'Pengumuman',
                'image' => $photos[0],
                'published_at' => '2026-10-03',
            ],
            [
                'slug' => 'workshop-iot-industri',
                'title' => 'Workshop Internet of Things bersama praktisi industri diikuti 120 mahasiswa',
                'excerpt' => 'Peserta mempraktikkan perakitan sensor dan dasbor pemantauan secara langsung.',
                'category' => 'Seminar & Workshop',
                'image' => $photos[1],
                'published_at' => '2026-09-29',
            ],
            [
                'slug' => 'publikasi-jurnal-internasional',
                'title' => 'Publikasi jurnal internasional bereputasi dosen fakultas meningkat dua kali lipat',
                'excerpt' => 'Peningkatan didorong oleh kolaborasi riset lintas program studi dan lintas negara.',
                'category' => 'Penelitian',
                'image' => $photos[2],
                'published_at' => '2026-09-25',
            ],
            [
                'slug' => 'mahasiswa-juara-hackathon',
                'title' => 'Mahasiswa Teknik Informatika juara hackathon pengembangan aplikasi kota cerdas',
                'excerpt' => 'Aplikasi pengelolaan sampah berbasis AI menyisihkan puluhan tim dari berbagai perguruan tinggi.',
                'category' => 'Prestasi',
                'image' => $photos[0],
                'published_at' => '2026-09-20',
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
