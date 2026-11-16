import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Building2,
    Calendar,
    ChevronRight,
    FlaskConical,
    GraduationCap,
    Handshake,
    Microscope,
    Quote,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import Blob from '@/components/blob';
import Pagination from '@/components/pagination';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

/* ------------------------------------------------------------------ */
/*  TYPES — sesuaikan dengan kolom tabel                                */
/* ------------------------------------------------------------------ */

type Faculty = {
    name: string;
    university: string;
    tagline: string;
    description: string;
    hero_image: string;
    vision: string;
    missions: string[];
    address: string;
    email: string;
    phone: string;
};

type Stat = { id: number; label: string; value: number; suffix?: string; image: string };

type Program = {
    id: number;
    slug: string;
    name: string;
    degree: string;
    accreditation: string;
    description: string;
    student_count: number;
};

type Service = { id: number; title: string; description: string; icon: string; url?: string | null };

type News = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    published_at: string;
};

type Testimonial = {
    id: number;
    name: string;
    batch: string;
    job: string;
    company: string;
    quote: string;
    photo: string;
};

/** Bentuk data dari `->paginate()` Laravel (hanya field yang dipakai). */
type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

type Props = {
    faculty?: Faculty;
    stats?: Stat[];
    programs?: Paginated<Program> | Program[];
    services?: Paginated<Service> | Service[];
    news?: News[];
    testimonials?: Testimonial[];
};

/* ------------------------------------------------------------------ */
/*  DATA CONTOH — dipakai selama controller belum mengirim props        */
/* ------------------------------------------------------------------ */

const img = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const DEFAULT_FACULTY: Faculty = {
    name: 'Fakultas Teknik dan Sains',
    university: 'Universitas Contoh Nusantara',
    tagline: 'Belajar di laboratorium, bekerja bersama industri, lulus siap berkarya.',
    description:
        'Kami mendidik mahasiswa lewat praktikum nyata, magang terstruktur, dan proyek bersama mitra industri, sehingga lulusan langsung paham dunia kerja.',
    hero_image: img('photo-1523240795612-9a054b0db644'),
    vision: 'Menjadi fakultas unggul di Asia Tenggara dalam pendidikan, riset terapan, dan kerja sama industri pada tahun 2035.',
    missions: [
        'Menyelenggarakan pembelajaran berbasis proyek dan praktik laboratorium yang relevan dengan kebutuhan industri.',
        'Mengembangkan riset terapan yang hasilnya dipakai masyarakat dan dunia usaha.',
        'Memperluas kerja sama dengan mitra industri, pemerintah, dan perguruan tinggi, di dalam maupun luar negeri.',
        'Membangun budaya akademik yang jujur, inklusif, dan mendorong mahasiswa berwirausaha.',
    ],
    address: 'Jl. Pendidikan No. 1, Serang, Banten 42111',
    email: 'fakultas@universitas.ac.id',
    phone: '(0254) 123 456',
};

const DEFAULT_STATS: Stat[] = [
    { id: 1, label: 'Mitra industri yang bekerja sama', value: 120, suffix: '+', image: img('photo-1552664730-d307ca884978') },
    { id: 2, label: 'Mahasiswa aktif', value: 3450, suffix: '', image: img('photo-1523050854058-8df90110c9f1') },
    { id: 3, label: 'Laboratorium', value: 18, suffix: '', image: img('photo-1581093458791-9f3c3900df4b') },
    { id: 4, label: 'Dosen', value: 85, suffix: '', image: img('photo-1524178232363-1fb2b075b655') },
];

const DEFAULT_PROGRAMS: Program[] = [
    { id: 1, slug: 'teknik-informatika', name: 'Teknik Informatika', degree: 'S1', accreditation: 'Unggul', description: 'Pemrograman, kecerdasan buatan, dan rekayasa perangkat lunak lewat proyek bersama perusahaan teknologi.', student_count: 820 },
    { id: 2, slug: 'teknik-elektro', name: 'Teknik Elektro', degree: 'S1', accreditation: 'Baik Sekali', description: 'Sistem tenaga, elektronika, dan otomasi industri dengan praktikum di laboratorium sendiri.', student_count: 540 },
    { id: 3, slug: 'teknik-industri', name: 'Teknik Industri', degree: 'S1', accreditation: 'Unggul', description: 'Perancangan sistem produksi, logistik, dan manajemen mutu untuk pabrik dan layanan.', student_count: 610 },
    { id: 4, slug: 'sistem-informasi', name: 'Sistem Informasi', degree: 'S1', accreditation: 'Baik Sekali', description: 'Analisis data dan sistem bisnis digital untuk organisasi yang sedang bertransformasi.', student_count: 700 },
    { id: 5, slug: 'kimia-terapan', name: 'Kimia Terapan', degree: 'D4', accreditation: 'Baik', description: 'Analisis kimia dan pengolahan material dengan standar laboratorium industri.', student_count: 280 },
    { id: 6, slug: 'magister-teknik', name: 'Magister Teknik', degree: 'S2', accreditation: 'Baik Sekali', description: 'Riset lanjutan untuk profesional yang ingin memimpin inovasi di bidangnya.', student_count: 140 },
];

const DEFAULT_SERVICES: Service[] = [
    { id: 1, title: 'Perpustakaan digital', description: 'Akses jurnal, e-book, dan skripsi dari mana saja.', icon: 'book', url: '/layanan/perpustakaan' },
    { id: 2, title: 'Peminjaman laboratorium', description: 'Ajukan jadwal dan alat praktikum secara daring.', icon: 'flask', url: '/layanan/laboratorium' },
    { id: 3, title: 'Magang dan karier', description: 'Lowongan magang, bursa kerja, dan konsultasi karier.', icon: 'handshake', url: '/layanan/karier' },
    { id: 4, title: 'Layanan akademik', description: 'KRS, transkrip, surat keterangan, dan cuti akademik.', icon: 'graduation', url: '/layanan/akademik' },
    { id: 5, title: 'Riset dan pengabdian', description: 'Pendaftaran hibah, etika penelitian, dan publikasi.', icon: 'microscope', url: '/layanan/riset' },
    { id: 6, title: 'Kemahasiswaan', description: 'Beasiswa, organisasi, dan konseling mahasiswa.', icon: 'users', url: '/layanan/kemahasiswaan' },
];

const DEFAULT_NEWS: News[] = [
    { id: 1, slug: 'kerja-sama-industri-baru', title: 'Fakultas menandatangani kerja sama dengan 12 mitra industri baru', excerpt: 'Kerja sama mencakup magang bersertifikat, kelas tamu, dan riset terapan bersama.', category: 'Kerja sama', image: img('photo-1521737604893-d14cc237f11d'), published_at: '2026-11-10' },
    { id: 2, slug: 'juara-kompetisi-nasional', title: 'Tim mahasiswa meraih juara pertama kompetisi robotika nasional', excerpt: 'Tim beranggotakan lima mahasiswa Teknik Elektro menyingkirkan 64 peserta dari seluruh Indonesia.', category: 'Prestasi', image: img('photo-1485827404703-89b55fcc595e'), published_at: '2026-11-04' },
    { id: 3, slug: 'laboratorium-baru', title: 'Laboratorium kecerdasan buatan resmi dibuka untuk mahasiswa', excerpt: 'Laboratorium dilengkapi 40 stasiun kerja GPU dan dapat dipakai untuk tugas akhir.', category: 'Fasilitas', image: img('photo-1581092918056-0c4c3acd3789'), published_at: '2026-10-28' },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    { id: 1, name: 'Rina Maharani', batch: 'Angkatan 2017', job: 'Software Engineer', company: 'Perusahaan Teknologi Nasional', quote: 'Proyek akhir saya dikerjakan bersama perusahaan mitra fakultas. Dua minggu setelah sidang, saya sudah ditawari kerja di sana.', photo: img('photo-1494790108377-be9c29b29330', 300) },
    { id: 2, name: 'Dimas Prakoso', batch: 'Angkatan 2015', job: 'Production Manager', company: 'Manufaktur Mandiri', quote: 'Praktikum di laboratorium membuat saya terbiasa memakai alat yang sama dengan yang ada di pabrik.', photo: img('photo-1500648767791-00dcc994a43e', 300) },
    { id: 3, name: 'Sari Wulandari', batch: 'Angkatan 2019', job: 'Founder', company: 'Startup Agritech', quote: 'Dosen pembimbing membantu saya mengubah tugas akhir menjadi usaha rintisan. Sekarang kami melayani 300 petani.', photo: img('photo-1438761681033-6461ffad8d80', 300) },
];

const ICONS: Record<string, LucideIcon> = {
    book: BookOpen,
    flask: FlaskConical,
    handshake: Handshake,
    graduation: GraduationCap,
    microscope: Microscope,
    users: Users,
    building: Building2,
};

/** Menerima array biasa (data contoh) maupun hasil paginate Laravel. */
function toPage<T>(value: Paginated<T> | T[]): Paginated<T> {
    if (Array.isArray(value)) {
        return { data: value, current_page: 1, last_page: 1, total: value.length, from: value.length ? 1 : null, to: value.length || null };
    }
    return value;
}

/** Pindah halaman tanpa reload penuh dan tanpa loncat ke atas; halaman milik section lain dipertahankan. */
function goToPage(param: 'prodi_page' | 'layanan_page', prop: 'programs' | 'services', page: number) {
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    if (page <= 1) delete query[param];
    else query[param] = String(page);

    router.get('/', query, { only: [prop], preserveScroll: true, preserveState: true, replace: true });
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const formatNumber = (n: number) => n.toLocaleString('id-ID');

/** Jeda bergilir per kolom, supaya baris bawah tidak menunggu terlalu lama. */
const stagger = (i: number, cols = 3) => (i % cols) * 110;

function SectionHeading({ title, text, center = false }: { title: string; text?: string; center?: boolean }) {
    return (
        <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
            <h2 className="text-3xl font-bold tracking-tight text-indigo-950 sm:text-4xl">{title}</h2>
            {text && <p className="mt-3 text-base leading-relaxed text-slate-600">{text}</p>}
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  HALAMAN                                                             */
/* ------------------------------------------------------------------ */

export default function Welcome({
    faculty = DEFAULT_FACULTY,
    stats = DEFAULT_STATS,
    programs: programsProp = DEFAULT_PROGRAMS,
    services: servicesProp = DEFAULT_SERVICES,
    news = DEFAULT_NEWS,
    testimonials = DEFAULT_TESTIMONIALS,
}: Props) {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const programs = toPage(programsProp);
    const services = toPage(servicesProp);

    const mainStat = stats[0];
    const otherStats = stats.slice(1);
    const current = testimonials[activeTestimonial];

    return (
        <PublicLayout faculty={faculty}>
            <Head title={faculty.name} />

            {/* ============ HERO ============ */}
            <section id="beranda" className="relative overflow-hidden">
                <Blob className="-left-32 -top-24 h-[28rem] w-[28rem] bg-gradient-to-br from-indigo-400/50 to-sky-300/40" />
                <Blob className="right-[-8rem] top-10 h-[30rem] w-[30rem] bg-gradient-to-br from-teal-300/50 to-emerald-200/40" />
                <Blob className="bottom-[-6rem] left-1/3 h-72 w-72 bg-gradient-to-br from-amber-200/60 to-orange-200/30" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-32 lg:pt-40">
                    <div>
                        <Reveal>
                            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-teal-500" />
                                Penerimaan mahasiswa baru 2027 telah dibuka
                            </p>
                        </Reveal>

                        <Reveal delay={120}>
                            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-indigo-950 sm:text-5xl">
                                {faculty.tagline}
                            </h1>
                        </Reveal>

                        <Reveal delay={240}>
                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{faculty.description}</p>
                        </Reveal>

                        <Reveal delay={360} className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#prodi"
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800"
                            >
                                Lihat program studi
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href="#visi-misi"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-indigo-300 hover:text-indigo-700"
                            >
                                Kenali fakultas
                            </a>
                        </Reveal>
                    </div>

                    {/* Kolase foto: mahasiswa + laboratorium */}
                    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                        <div className="grid grid-cols-5 grid-rows-6 gap-3 sm:gap-4">
                            <Reveal delay={200} className="col-span-3 row-span-4 min-h-[17rem]">
                                <img src={faculty.hero_image} alt="Mahasiswa berdiskusi di kampus" className="h-full w-full rounded-3xl object-cover shadow-xl" />
                            </Reveal>
                            <Reveal delay={340} className="col-span-2 row-span-3">
                                <img src={img('photo-1532094349884-543bc11b234d', 700)} alt="Praktikum di laboratorium" className="h-full w-full rounded-3xl object-cover shadow-xl" />
                            </Reveal>
                            <Reveal delay={480} className="col-span-2 row-span-3">
                                <img src={img('photo-1522202176988-66273c2fd55f', 700)} alt="Mahasiswa belajar kelompok" className="h-full w-full rounded-3xl object-cover shadow-xl" />
                            </Reveal>
                            <Reveal delay={620} className="col-span-3 row-span-2">
                                <img src={img('photo-1581091226825-a6a2a5aee158', 900)} alt="Mahasiswa memakai peralatan laboratorium" className="h-full w-full rounded-3xl object-cover shadow-xl" />
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ STATISTIK (card + foto) ============ */}
            <section aria-label="Angka fakultas" className="relative z-10 -mt-12 pb-20 lg:-mt-16">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {mainStat && (
                        <Reveal className="col-span-full lg:col-span-2 lg:row-span-2">
                            <article className="group relative isolate h-full overflow-hidden rounded-3xl">
                                <img src={mainStat.image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-indigo-950 via-indigo-950/70 to-indigo-900/20" />
                                <div className="flex h-full min-h-[22rem] flex-col justify-end p-8">
                                    <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
                                        <Handshake className="h-6 w-6" />
                                    </span>
                                    <p className="text-6xl font-extrabold text-white">
                                        {formatNumber(mainStat.value)}
                                        {mainStat.suffix}
                                    </p>
                                    <p className="mt-2 text-lg font-medium text-indigo-100">{mainStat.label}</p>
                                </div>
                            </article>
                        </Reveal>
                    )}

                    {otherStats.map((s, i) => (
                        <Reveal key={s.id} delay={150 + i * 110}>
                            <article className="group relative isolate h-full overflow-hidden rounded-3xl">
                                <img src={s.image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-teal-950/90 via-indigo-950/50 to-transparent" />
                                <div className="flex h-full min-h-[10.5rem] flex-col justify-end p-5">
                                    <p className="text-4xl font-extrabold text-white">
                                        {formatNumber(s.value)}
                                        {s.suffix}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-teal-50">{s.label}</p>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ============ VISI & MISI ============ */}
            <section id="visi-misi" className="relative overflow-hidden bg-white py-20 lg:py-28">
                <Blob className="-right-24 top-0 h-80 w-80 bg-gradient-to-br from-sky-200/60 to-indigo-200/40" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:gap-14 lg:px-8">
                    <div className="lg:col-span-2">
                        <SectionHeading title="Visi dan misi" text="Arah yang kami tuju dan cara kami mencapainya." />
                        <Reveal delay={120} className="mt-8">
                            <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-500 p-8 text-white shadow-xl shadow-indigo-600/20">
                                <h3 className="text-lg font-bold text-indigo-100">Visi</h3>
                                <p className="mt-3 text-xl font-medium leading-relaxed">{faculty.vision}</p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-3">
                        <Reveal>
                            <h3 className="mb-5 text-xl font-bold text-indigo-950">Misi</h3>
                        </Reveal>
                        <ul className="space-y-3">
                            {faculty.missions.map((m, i) => (
                                <Reveal as="li" key={i} delay={i * 110}>
                                    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-700">
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                        <p className="leading-relaxed text-slate-700">{m}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ============ PROGRAM STUDI ============ */}
            <section id="prodi" className="relative overflow-hidden py-20 lg:py-28">
                <Blob className="-left-24 top-20 h-96 w-96 bg-gradient-to-br from-teal-200/50 to-sky-200/40" />
                <Blob className="bottom-0 right-0 h-80 w-80 bg-gradient-to-br from-amber-200/50 to-rose-100/40" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Program studi" text="Pilih jalur belajar yang sesuai dengan minat dan rencana kariermu." />

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {programs.data.map((p, i) => (
                            <Reveal key={p.id} delay={stagger(i)} className="h-full">
                                <Link
                                    href={`/prodi/${p.slug}`}
                                    className="group flex h-full flex-col rounded-3xl border border-white bg-white/80 p-7 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-sm font-semibold text-indigo-700">{p.degree}</span>
                                        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800">Akreditasi {p.accreditation}</span>
                                    </div>
                                    <h3 className="mt-5 text-xl font-bold text-indigo-950">{p.name}</h3>
                                    <p className="mt-2 flex-1 leading-relaxed text-slate-600">{p.description}</p>
                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                                        <span className="flex items-center gap-1.5 text-slate-500">
                                            <Users className="h-4 w-4" />
                                            {formatNumber(p.student_count)} mahasiswa
                                        </span>
                                        <span className="flex items-center gap-1 font-semibold text-indigo-700">
                                            Selengkapnya
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                    <Pagination
                        label="program studi"
                        current={programs.current_page}
                        last={programs.last_page}
                        total={programs.total}
                        from={programs.from}
                        to={programs.to}
                        onChange={(page) => goToPage('prodi_page', 'programs', page)}
                    />
                </div>
            </section>

            {/* ============ LAYANAN ============ */}
            <section id="layanan" className="relative overflow-hidden bg-gradient-to-b from-indigo-950 to-indigo-900 py-20 lg:py-28">
                <Blob className="-left-20 top-10 h-96 w-96 bg-gradient-to-br from-indigo-500/40 to-sky-400/20" />
                <Blob className="-right-20 bottom-0 h-96 w-96 bg-gradient-to-br from-teal-400/30 to-emerald-300/10" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Layanan fakultas</h2>
                        <p className="mt-3 text-base leading-relaxed text-indigo-200">Urusan akademik dan fasilitas yang bisa kamu akses kapan saja.</p>
                    </Reveal>

                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {services.data.map((s, i) => {
                            const Icon = ICONS[s.icon] ?? Building2;
                            return (
                                <Reveal key={s.id} delay={stagger(i)} className="h-full">
                                    <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:bg-white/10">
                                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-sky-400 text-indigo-950">
                                            <Icon className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                                        <p className="mt-2 flex-1 leading-relaxed text-indigo-200">{s.description}</p>
                                        <Link
                                            href={s.url ?? '#layanan'}
                                            className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                                        >
                                            Pergi sekarang
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </Link>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>

                    <Pagination
                        tone="dark"
                        label="layanan"
                        current={services.current_page}
                        last={services.last_page}
                        total={services.total}
                        from={services.from}
                        to={services.to}
                        onChange={(page) => goToPage('layanan_page', 'services', page)}
                    />
                </div>
            </section>

            {/* ============ BERITA ============ */}
            <section id="berita" className="relative overflow-hidden py-20 lg:py-28">
                <Blob className="right-0 top-10 h-80 w-80 bg-gradient-to-br from-sky-200/60 to-teal-200/30" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <SectionHeading title="Berita terbaru" text="Kabar prestasi, kegiatan, dan kerja sama dari fakultas." />
                        <Reveal delay={150}>
                            <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">
                                Semua berita
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Reveal>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {news.map((n, i) => (
                            <Reveal key={n.id} delay={stagger(i)} className="h-full">
                                <Link
                                    href={`/berita/${n.slug}`}
                                    className="group block h-full overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-xl hover:shadow-indigo-900/5"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img src={n.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                        <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-2.5 py-1 text-sm font-semibold text-indigo-700 backdrop-blur">
                                            {n.category}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <p className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(n.published_at)}
                                        </p>
                                        <h3 className="mt-3 text-lg font-bold leading-snug text-indigo-950 group-hover:text-indigo-700">{n.title}</h3>
                                        <p className="mt-2 line-clamp-2 leading-relaxed text-slate-600">{n.excerpt}</p>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ KOMENTAR ALUMNI ============ */}
            {current && (
                <section id="alumni" className="relative overflow-hidden bg-white py-20 lg:py-28">
                    <Blob className="-left-20 bottom-0 h-96 w-96 bg-gradient-to-br from-amber-200/50 to-teal-200/40" />
                    <Blob className="-right-24 top-0 h-80 w-80 bg-gradient-to-br from-indigo-200/60 to-sky-200/40" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading center title="Kata alumni" text="Cerita lulusan yang sudah bekerja dan berwirausaha." />

                        <div className="mx-auto mt-12 max-w-3xl">
                            <Reveal delay={100}>
                                <figure key={current.id} className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-indigo-900/5 backdrop-blur sm:p-10">
                                    <Quote className="h-8 w-8 text-teal-500" />
                                    <blockquote className="mt-4 text-xl leading-relaxed text-slate-800 sm:text-2xl">{current.quote}</blockquote>
                                    <figcaption className="mt-8 flex items-center gap-4">
                                        <img src={current.photo} alt={current.name} className="h-14 w-14 rounded-full object-cover ring-4 ring-indigo-100" />
                                        <div>
                                            <p className="font-bold text-indigo-950">{current.name}</p>
                                            <p className="text-sm text-slate-500">
                                                {current.job}, {current.company}
                                            </p>
                                            <p className="text-sm text-slate-400">{current.batch}</p>
                                        </div>
                                    </figcaption>
                                </figure>
                            </Reveal>

                            <Reveal delay={220}>
                                <div className="mt-6 flex justify-center gap-3" role="tablist" aria-label="Pilih testimoni">
                                    {testimonials.map((t, i) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={i === activeTestimonial}
                                            aria-label={`Testimoni ${t.name}`}
                                            onClick={() => setActiveTestimonial(i)}
                                            className={`h-14 w-14 overflow-hidden rounded-full ring-2 transition ${
                                                i === activeTestimonial ? 'scale-110 ring-indigo-600' : 'opacity-60 ring-transparent hover:opacity-100'
                                            }`}
                                        >
                                            <img src={t.photo} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}