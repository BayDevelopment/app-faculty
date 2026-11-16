<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramDetailSeeder extends Seeder
{
    public function run(): void
    {
        $img = fn (string $id, int $w = 1400) => "https://images.unsplash.com/{$id}?auto=format&fit=crop&w={$w}&q=80";

        $headPhotos = [
            $img('photo-1560250097-0b93528c311a', 400),
            $img('photo-1573496359142-b8d87734a5a2', 400),
            $img('photo-1507003211169-0a1dd7228f2d', 400),
            $img('photo-1580489944761-15a19d654956', 400),
        ];

        $data = [
            'teknik-informatika' => [
                'photo' => 'photo-1581093458791-9f3c3900df4b', 'head' => 'Dr. Hendra Wijaya, M.T.',
                'overview' => "Teknik Informatika membekali mahasiswa dengan dasar komputasi, rekayasa perangkat lunak, dan kecerdasan buatan.\n\nSejak semester lima, mahasiswa mengerjakan proyek nyata bersama perusahaan teknologi mitra, sehingga portofolio sudah terbentuk sebelum lulus.",
                'vision' => 'Menjadi program studi informatika rujukan nasional yang menghasilkan lulusan siap kerja dan siap berwirausaha digital.',
                'competencies' => ['Merancang dan membangun aplikasi web, seluler, dan sistem terdistribusi', 'Menerapkan kecerdasan buatan dan analisis data untuk menyelesaikan masalah nyata', 'Bekerja dalam tim pengembang dengan standar rekayasa perangkat lunak industri'],
                'careers' => ['Software Engineer', 'Data Scientist', 'Product Manager', 'Penguji Perangkat Lunak', 'Pendiri Startup Teknologi'],
                'facilities' => ['Laboratorium kecerdasan buatan dengan 40 stasiun kerja GPU', 'Laboratorium jaringan dan keamanan siber', 'Ruang kolaborasi proyek bersama industri'],
                'core' => ['Struktur Data', 'Algoritma dan Pemrograman Lanjut', 'Basis Data', 'Sistem Operasi', 'Rekayasa Perangkat Lunak', 'Jaringan Komputer', 'Pembelajaran Mesin', 'Pemrograman Web dan Seluler'],
            ],
            'teknik-elektro' => [
                'photo' => 'photo-1581092918056-0c4c3acd3789', 'head' => 'Dr. Ir. Sinta Permatasari, M.Eng.',
                'overview' => "Teknik Elektro mempelajari sistem tenaga, elektronika, dan otomasi yang menggerakkan industri modern.\n\nPraktikum dilakukan di laboratorium milik fakultas dengan peralatan yang setara dengan yang dipakai di pabrik.",
                'vision' => 'Menjadi program studi elektro unggul dalam energi, otomasi, dan sistem tertanam di tingkat Asia Tenggara.',
                'competencies' => ['Merancang sistem tenaga listrik dan energi terbarukan', 'Membangun sistem kendali dan otomasi industri', 'Mengembangkan perangkat elektronika dan sistem tertanam'],
                'careers' => ['Insinyur Tenaga Listrik', 'Insinyur Otomasi', 'Teknisi Instrumentasi', 'Engineer Sistem Tertanam'],
                'facilities' => ['Laboratorium sistem tenaga dan energi terbarukan', 'Laboratorium otomasi dan robotika', 'Bengkel elektronika dan pembuatan PCB'],
                'core' => ['Rangkaian Listrik', 'Elektronika Analog', 'Elektronika Digital', 'Sistem Kendali', 'Mesin Listrik', 'Sistem Tenaga', 'Mikrokontroler', 'Sinyal dan Sistem'],
            ],
            'teknik-industri' => [
                'photo' => 'photo-1581091226825-a6a2a5aee158', 'head' => 'Dr. Ir. Bambang Setiawan, M.T.',
                'overview' => "Teknik Industri merancang cara kerja yang efisien, dari lantai produksi sampai rantai pasok.\n\nMahasiswa belajar memperbaiki proses nyata lewat studi kasus dan magang di pabrik mitra.",
                'vision' => 'Menjadi program studi teknik industri yang menghasilkan perancang sistem produksi dan logistik berdaya saing global.',
                'competencies' => ['Menganalisis dan memperbaiki sistem produksi', 'Mengelola rantai pasok dan logistik', 'Menerapkan manajemen mutu dan keselamatan kerja'],
                'careers' => ['Production Planner', 'Supply Chain Analyst', 'Quality Engineer', 'Konsultan Operasional'],
                'facilities' => ['Laboratorium ergonomi dan perancangan kerja', 'Laboratorium simulasi produksi', 'Ruang studi kasus bersama pabrik mitra'],
                'core' => ['Perancangan Sistem Kerja', 'Penelitian Operasional', 'Perencanaan Produksi', 'Pengendalian Kualitas', 'Manajemen Rantai Pasok', 'Ergonomi', 'Simulasi Sistem', 'Tata Letak Fasilitas'],
            ],
            'sistem-informasi' => [
                'photo' => 'photo-1532094349884-543bc11b234d', 'head' => 'Dr. Maya Anggraini, M.Kom.',
                'overview' => "Sistem Informasi menghubungkan teknologi dengan kebutuhan bisnis dan organisasi.\n\nLulusan mampu menganalisis proses, merancang sistem, dan mengolah data menjadi keputusan.",
                'vision' => 'Menjadi program studi sistem informasi yang menghasilkan analis dan pemimpin transformasi digital.',
                'competencies' => ['Menganalisis kebutuhan bisnis dan merancang sistem informasi', 'Mengolah dan memvisualisasikan data untuk pengambilan keputusan', 'Mengelola proyek dan tata kelola teknologi informasi'],
                'careers' => ['Business Analyst', 'System Analyst', 'Data Analyst', 'IT Consultant'],
                'facilities' => ['Laboratorium analitik data', 'Laboratorium sistem enterprise (ERP)', 'Ruang inkubasi proyek digital'],
                'core' => ['Analisis dan Perancangan Sistem', 'Basis Data Lanjut', 'Sistem Enterprise', 'Manajemen Proyek TI', 'Business Intelligence', 'Tata Kelola TI', 'Keamanan Informasi', 'Interaksi Manusia dan Komputer'],
            ],
            'kimia-terapan' => [
                'photo' => 'photo-1522202176988-66273c2fd55f', 'head' => 'Dr. Rahmat Hidayat, M.Si.',
                'overview' => "Kimia Terapan berfokus pada analisis dan pengolahan material dengan standar laboratorium industri.\n\nMahasiswa terbiasa memakai instrumen analisis yang juga dipakai di perusahaan kimia dan farmasi.",
                'vision' => 'Menjadi program vokasi kimia terapan yang menghasilkan analis dan teknisi laboratorium bersertifikat.',
                'competencies' => ['Melakukan analisis kimia kualitatif dan kuantitatif', 'Mengoperasikan instrumen analisis modern', 'Menerapkan keselamatan kerja dan standar mutu laboratorium'],
                'careers' => ['Analis Laboratorium', 'Quality Control Officer', 'Teknisi Proses', 'Petugas K3 Laboratorium'],
                'facilities' => ['Laboratorium kimia analitik', 'Laboratorium instrumentasi (GC, HPLC, spektrofotometer)', 'Laboratorium pengolahan material'],
                'core' => ['Kimia Analitik', 'Kimia Organik', 'Kimia Fisika', 'Instrumentasi Analisis', 'Pengolahan Material', 'Kimia Lingkungan', 'Pengendalian Mutu', 'Keselamatan Laboratorium'],
            ],
            'teknik-sipil' => [
                'photo' => 'photo-1523240795612-9a054b0db644', 'head' => 'Dr. Ir. Agus Nugroho, M.T.',
                'overview' => "Teknik Sipil mempelajari perencanaan dan pembangunan infrastruktur, mulai dari gedung sampai jalan dan jembatan.\n\nPraktik lapangan dilakukan bersama kontraktor dan konsultan mitra.",
                'vision' => 'Menjadi program studi teknik sipil yang menghasilkan perencana infrastruktur yang andal dan berwawasan lingkungan.',
                'competencies' => ['Merencanakan struktur bangunan dan infrastruktur', 'Mengelola proyek konstruksi', 'Menganalisis tanah, air, dan transportasi'],
                'careers' => ['Insinyur Struktur', 'Pelaksana Proyek', 'Konsultan Perencana', 'Pengawas Konstruksi'],
                'facilities' => ['Laboratorium mekanika tanah', 'Laboratorium bahan konstruksi', 'Studio perancangan dan perangkat lunak struktur'],
                'core' => ['Mekanika Bahan', 'Analisis Struktur', 'Mekanika Tanah', 'Hidrolika', 'Beton Bertulang', 'Rekayasa Transportasi', 'Manajemen Konstruksi', 'Teknik Pondasi'],
            ],
            'matematika' => [
                'photo' => 'photo-1485827404703-89b55fcc595e', 'head' => 'Dr. Lestari Handayani, M.Si.',
                'overview' => "Matematika menjadi dasar bagi riset, analisis data, dan komputasi sains.\n\nMahasiswa dilatih berpikir logis dan memodelkan persoalan nyata menjadi persamaan yang bisa diselesaikan.",
                'vision' => 'Menjadi program studi matematika yang unggul dalam pemodelan dan komputasi sains.',
                'competencies' => ['Memodelkan masalah nyata secara matematis', 'Menganalisis data dengan metode statistika', 'Menerapkan komputasi numerik dan optimasi'],
                'careers' => ['Data Analyst', 'Aktuaris', 'Peneliti', 'Guru dan Dosen Matematika'],
                'facilities' => ['Laboratorium komputasi', 'Ruang studi statistika', 'Perpustakaan jurnal matematika'],
                'core' => ['Aljabar Linear', 'Analisis Real', 'Persamaan Diferensial', 'Statistika Matematika', 'Metode Numerik', 'Optimasi', 'Pemodelan Matematika', 'Teori Peluang'],
            ],
            'magister-teknik' => [
                'photo' => 'photo-1521737604893-d14cc237f11d', 'head' => 'Prof. Dr. Ir. Wahyu Pratama, M.Sc.', 'master' => true,
                'overview' => "Magister Teknik ditujukan bagi sarjana dan profesional yang ingin memperdalam riset terapan.\n\nPerkuliahan dijadwalkan fleksibel sehingga mahasiswa yang bekerja tetap bisa mengikuti.",
                'vision' => 'Menjadi program magister yang melahirkan peneliti dan pemimpin inovasi teknik.',
                'competencies' => ['Merancang dan melaksanakan penelitian terapan', 'Memimpin proyek inovasi lintas bidang', 'Menerbitkan hasil penelitian pada jurnal bereputasi'],
                'careers' => ['Peneliti', 'Manajer R&D', 'Dosen', 'Konsultan Teknik'],
                'facilities' => ['Ruang riset bersama', 'Akses jurnal dan basis data internasional', 'Laboratorium penelitian lanjutan'],
                'core' => ['Metodologi Penelitian Lanjut', 'Statistika Terapan', 'Pemodelan dan Simulasi', 'Manajemen Inovasi', 'Topik Khusus 1', 'Topik Khusus 2', 'Etika Riset', 'Penulisan Ilmiah'],
            ],
        ];

        $i = 0;
        foreach ($data as $slug => $d) {
            $program = Program::where('slug', $slug)->first();
            if (! $program) {
                continue;
            }

            $master = $d['master'] ?? false;

            $program->update([
                'hero_image' => $img($d['photo']),
                'overview' => $d['overview'],
                'vision' => $d['vision'],
                'duration' => $master ? '4 semester' : '8 semester',
                'credits' => $master ? 42 : 144,
                'head_name' => $d['head'],
                'head_title' => 'Ketua Program Studi',
                'head_photo' => $headPhotos[$i % count($headPhotos)],
                'competencies' => $d['competencies'],
                'curriculum' => $this->curriculum($d['core'], $master),
                'career_prospects' => $d['careers'],
                'facilities' => $d['facilities'],
                'admission_requirements' => $master
                    ? ['Memiliki ijazah sarjana (S1) dari program studi yang sesuai', 'Transkrip nilai dengan IPK minimal 2,75', 'Proposal riset singkat', 'Lulus tes potensi akademik dan wawancara']
                    : ['Lulusan SMA/SMK/MA sederajat', 'Nilai rapor semester 1 sampai 5 memenuhi syarat seleksi', 'Mengisi formulir pendaftaran dan mengunggah berkas', 'Lulus tes seleksi masuk'],
                'contact_email' => "{$slug}@universitas.ac.id",
                'contact_phone' => '(0254) 123 456',
            ]);

            $i++;
        }
    }

    private function curriculum(array $core, bool $master): array
    {
        if ($master) {
            return [
                ['semester' => 1, 'courses' => array_slice($core, 0, 4)],
                ['semester' => 2, 'courses' => array_slice($core, 4, 4)],
                ['semester' => 3, 'courses' => ['Seminar Proposal Tesis', 'Publikasi Ilmiah', 'Riset Lapangan']],
                ['semester' => 4, 'courses' => ['Seminar Hasil', 'Tesis', 'Ujian Tesis']],
            ];
        }

        return [
            ['semester' => 1, 'courses' => ['Pendidikan Pancasila', 'Bahasa Indonesia', 'Matematika Dasar', 'Fisika Dasar']],
            ['semester' => 2, 'courses' => ['Bahasa Inggris Akademik', 'Kalkulus', 'Pengantar Teknologi', 'Etika Profesi']],
            ['semester' => 3, 'courses' => array_slice($core, 0, 4)],
            ['semester' => 4, 'courses' => array_slice($core, 4, 4)],
            ['semester' => 5, 'courses' => ['Mata Kuliah Pilihan 1', 'Mata Kuliah Pilihan 2', 'Metodologi Penelitian', 'Kewirausahaan']],
            ['semester' => 6, 'courses' => ['Proyek Bersama Industri', 'Mata Kuliah Pilihan 3', 'Statistika Terapan']],
            ['semester' => 7, 'courses' => ['Kerja Praktik / Magang', 'Kuliah Kerja Nyata']],
            ['semester' => 8, 'courses' => ['Skripsi', 'Seminar Hasil Penelitian']],
        ];
    }
}
