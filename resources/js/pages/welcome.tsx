import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowRight,
    BookOpen,
    Building2,
    Calendar,
    ChevronRight,
    FlaskConical,
    GraduationCap,
    Handshake,
    Mail,
    MapPin,
    Microscope,
    Phone,
    Quote,
    Users,
    type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Blob from "@/components/blob";
import Pagination from "@/components/pagination";
import Reveal from "@/components/reveal";
import PublicLayout from "@/layouts/public-layout";

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

type Stat = {
    id: number;
    label: string;
    value: number;
    suffix?: string | null;
    image?: string | null;
};

type Program = {
    id: number;
    slug: string;
    name: string;
    degree: string;
    accreditation: string;
    description: string;
    student_count: number;
};

type Service = {
    id: number;
    title: string;
    description: string;
    icon: string;
    url?: string | null;
};

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
    photo: string | null;
};
type HeroPhoto = {
    posisi: number;
    url: string;
    alt: string | null;
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
    heroPhotos?: HeroPhoto[];
    stats?: Stat[];
    programs?: Paginated<Program> | Program[];
    services?: Paginated<Service> | Service[];
    news?: News[];
    testimonials?: Testimonial[];
};

/* ------------------------------------------------------------------ */
/*  DATA CONTOH — dipakai selama controller belum mengirim props        */
/* ------------------------------------------------------------------ */

const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const DEFAULT_FACULTY: Faculty = {
    name: "Fakultas Teknik",
    university: "Universitas Al-Khairiyah",
    tagline:
        "Belajar teknik lewat praktik, siap bekerja di industri dan proses produksi.",
    description:
        "Fakultas Teknik Universitas Al-Khairiyah menyelenggarakan program studi Teknik Industri dan Teknik Kimia dengan praktikum laboratorium, kunjungan industri, dan proyek bersama mitra.",
    hero_image: img("photo-1523240795612-9a054b0db644"),
    vision: "Menjadi fakultas teknik yang unggul dalam pendidikan, riset terapan, dan kerja sama dengan industri, berlandaskan nilai-nilai keislaman.",
    missions: [
        "Menyelenggarakan pembelajaran berbasis proyek dan praktik laboratorium yang relevan dengan kebutuhan industri.",
        "Mengembangkan riset terapan di bidang sistem produksi dan proses kimia yang bermanfaat bagi masyarakat dan dunia usaha.",
        "Memperluas kerja sama dengan industri, pemerintah, dan perguruan tinggi lain.",
        "Membangun budaya akademik yang jujur, berakhlak, dan mendorong mahasiswa berwirausaha.",
    ],
    // TODO: ganti dengan alamat resmi kampus
    address: "Cilegon, Banten",
    email: "teknik@alkhairiyah.ac.id",
    phone: "(0254) 123 456",
};
const DEFAULT_HERO_PHOTOS: HeroPhoto[] = [
    {
        posisi: 1,
        url: img("photo-1523240795612-9a054b0db644", 1200),
        alt: "Mahasiswa berdiskusi di kampus",
    },
    {
        posisi: 2,
        url: img("photo-1532094349884-543bc11b234d", 700),
        alt: "Praktikum di laboratorium",
    },
    {
        posisi: 3,
        url: img("photo-1522202176988-66273c2fd55f", 700),
        alt: "Mahasiswa belajar kelompok",
    },
    {
        posisi: 4,
        url: img("photo-1581091226825-a6a2a5aee158", 900),
        alt: "Mahasiswa memakai peralatan laboratorium",
    },
];

const DEFAULT_STATS: Stat[] = [
    {
        id: 1,
        label: "Mitra industri yang bekerja sama",
        value: 120,
        suffix: "+",
        image: null,
    },
    {
        id: 2,
        label: "Mahasiswa aktif",
        value: 3450,
        suffix: "",
        image: null,
    },
    {
        id: 3,
        label: "Laboratorium",
        value: 18,
        suffix: "",
        image: null,
    },
    {
        id: 4,
        label: "Dosen",
        value: 85,
        suffix: "",
        image: null,
    },
];

const DEFAULT_PROGRAMS: Program[] = [
    {
        id: 1,
        slug: "teknik-industri",
        name: "Teknik Industri",
        degree: "S1",
        accreditation: "Baik Sekali",
        description:
            "Perancangan sistem produksi, logistik, ergonomi, dan manajemen mutu untuk pabrik dan perusahaan jasa.",
        student_count: 320,
    },
    {
        id: 2,
        slug: "teknik-kimia",
        name: "Teknik Kimia",
        degree: "S1",
        accreditation: "Baik Sekali",
        description:
            "Proses pengolahan bahan kimia, energi, dan lingkungan dengan praktikum di laboratorium dan kunjungan ke industri.",
        student_count: 280,
    },
];

const DEFAULT_SERVICES: Service[] = [
    {
        id: 1,
        title: "Perpustakaan digital",
        description: "Akses jurnal, e-book, dan skripsi dari mana saja.",
        icon: "book",
        url: "/layanan/perpustakaan",
    },
    {
        id: 2,
        title: "Peminjaman laboratorium",
        description: "Ajukan jadwal dan alat praktikum secara daring.",
        icon: "flask",
        url: "/layanan/laboratorium",
    },
    {
        id: 3,
        title: "Magang dan karier",
        description: "Lowongan magang, bursa kerja, dan konsultasi karier.",
        icon: "handshake",
        url: "/layanan/karier",
    },
    {
        id: 4,
        title: "Layanan akademik",
        description: "KRS, transkrip, surat keterangan, dan cuti akademik.",
        icon: "graduation",
        url: "/layanan/akademik",
    },
    {
        id: 5,
        title: "Riset dan pengabdian",
        description: "Pendaftaran hibah, etika penelitian, dan publikasi.",
        icon: "microscope",
        url: "/layanan/riset",
    },
    {
        id: 6,
        title: "Kemahasiswaan",
        description: "Beasiswa, organisasi, dan konseling mahasiswa.",
        icon: "users",
        url: "/layanan/kemahasiswaan",
    },
];

const DEFAULT_NEWS: News[] = [
    {
        id: 1,
        slug: "kunjungan-industri-teknik-kimia",
        title: "Mahasiswa Teknik Kimia mengikuti kunjungan industri ke pabrik petrokimia",
        excerpt:
            "Mahasiswa melihat langsung proses produksi dan berdiskusi dengan para insinyur di lokasi.",
        category: "Kegiatan",
        image: img("photo-1581093458791-9f3c3900df4b"),
        published_at: "2026-11-10",
    },
    {
        id: 2,
        slug: "kerja-sama-industri-baru",
        title: "Fakultas Teknik menjalin kerja sama magang dengan mitra industri",
        excerpt:
            "Kerja sama mencakup magang, kelas tamu, dan proyek tugas akhir bersama.",
        category: "Kerja sama",
        image: img("photo-1521737604893-d14cc237f11d"),
        published_at: "2026-11-04",
    },
    {
        id: 3,
        slug: "praktikum-laboratorium",
        title: "Praktikum Teknik Industri kini memakai simulasi lini produksi",
        excerpt:
            "Mahasiswa merancang dan menguji tata letak pabrik sebelum menerapkannya di proyek akhir.",
        category: "Akademik",
        image: img("photo-1581092918056-0c4c3acd3789"),
        published_at: "2026-10-28",
    },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Rina Maharani",
        batch: "Alumni Teknik Industri",
        job: "Staf Perencanaan Produksi",
        company: "Perusahaan Manufaktur",
        quote: "Proyek tata letak pabrik di kampus sangat membantu saya saat mulai bekerja di bagian perencanaan produksi.",
        photo: img("photo-1494790108377-be9c29b29330", 300),
    },
    {
        id: 2,
        name: "Dimas Prakoso",
        batch: "Alumni Teknik Kimia",
        job: "Analis Laboratorium",
        company: "Perusahaan Kimia",
        quote: "Praktikum di laboratorium membuat saya terbiasa dengan prosedur dan alat yang dipakai di industri.",
        photo: img("photo-1500648767791-00dcc994a43e", 300),
    },
    {
        id: 3,
        name: "Sari Wulandari",
        batch: "Alumni Teknik Industri",
        job: "Pendiri",
        company: "Usaha Rintisan Logistik",
        quote: "Dosen pembimbing membantu saya mengembangkan tugas akhir menjadi usaha yang kini berjalan.",
        photo: img("photo-1438761681033-6461ffad8d80", 300),
    },
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

/* Lokasi kampus untuk peta (tanpa API key). Ubah query bila pin kurang tepat. */
const MAP_QUERY = "Universitas Al-Khairiyah, Cilegon, Banten";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

function AnimatedNumber({
    value,
    duration = 1800,
}: {
    value: number;
    duration?: number;
}) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const element = document.getElementById(`stat-${value}`);

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.3,
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [value, started]);

    useEffect(() => {
        if (!started) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (startTime === null) {
                startTime = currentTime;
            }

            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease-out agar awal cepat lalu melambat
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(easedProgress * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [started, value, duration]);

    return <span id={`stat-${value}`}>{formatNumber(count)}</span>;
}

/** Menerima array biasa (data contoh) maupun hasil paginate Laravel. */
function toPage<T>(value: Paginated<T> | T[]): Paginated<T> {
    if (Array.isArray(value)) {
        return {
            data: value,
            current_page: 1,
            last_page: 1,
            total: value.length,
            from: value.length ? 1 : null,
            to: value.length || null,
        };
    }
    return value;
}

/** Pindah halaman tanpa reload penuh dan tanpa loncat ke atas; halaman milik section lain dipertahankan. */
function goToPage(
    param: "prodi_page" | "layanan_page",
    prop: "programs" | "services",
    page: number,
) {
    const query = Object.fromEntries(
        new URLSearchParams(window.location.search),
    );
    if (page <= 1) delete query[param];
    else query[param] = String(page);

    router.get("/", query, {
        only: [prop],
        preserveScroll: true,
        preserveState: true,
        replace: true,
    });
}

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
const formatNumber = (n: number) => n.toLocaleString("id-ID");

/** Jeda bergilir per kolom, supaya baris bawah tidak menunggu terlalu lama. */
const stagger = (i: number, cols = 3) => (i % cols) * 110;

/** Sembunyikan gambar yang gagal dimuat agar tidak muncul ikon rusak. */
const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = "hidden";
};

function SectionHeading({
    title,
    text,
    center = false,
}: {
    title: string;
    text?: string;
    center?: boolean;
}) {
    return (
        <Reveal
            className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
        >
            <h2 className="text-3xl font-bold tracking-tight text-indigo-950 sm:text-4xl">
                {title}
            </h2>
            {text && (
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                    {text}
                </p>
            )}
        </Reveal>
    );
}

/** Tombol layanan: tidak tampil bila url kosong atau "#". */
function ServiceLink({ url }: { url?: string | null }) {
    if (!url || url === "#") {
        return (
            <span className="mt-6 inline-flex w-fit rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-indigo-300">
                Segera hadir
            </span>
        );
    }

    const cls =
        "mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950";

    const content = (
        <>
            Pergi sekarang
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </>
    );

    // link ke situs lain: <a> biasa, buka di tab baru
    if (/^https?:\/\//i.test(url)) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
            >
                {content}
            </a>
        );
    }

    // anchor di halaman yang sama, mis. "#kontak"
    if (url.startsWith("#")) {
        return (
            <a href={url} className={cls}>
                {content}
            </a>
        );
    }

    // path internal, mis. "/layanan/akademik": navigasi Inertia
    return (
        <Link href={url} className={cls}>
            {content}
        </Link>
    );
}
/** Foto alumni; tanpa foto (atau gagal dimuat) tampil inisial nama. */
function Avatar({
    src,
    name,
    alt,
    className,
}: {
    src?: string | null;
    name: string;
    alt?: string;
    className: string;
}) {
    const [failed, setFailed] = useState(false);

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={alt ?? name}
                onError={() => setFailed(true)}
                className={`${className} object-cover`}
            />
        );
    }

    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");

    return (
        <span
            className={`${className} grid place-items-center text-base font-bold text-indigo-700`}
        >
            {initials}
        </span>
    );
}
/* ------------------------------------------------------------------ */
/*  HALAMAN                                                             */
/* ------------------------------------------------------------------ */
/** Satu kolom foto yang berjalan terus ke atas atau ke bawah. */
function MarqueeColumn({
    photos,
    direction,
}: {
    photos: HeroPhoto[];
    direction: "up" | "down";
}) {
    // Pastikan satu putaran cukup tinggi, lalu gandakan agar loop mulus.
    const base = photos.length >= 3 ? photos : [...photos, ...photos];
    const loop = [...base, ...base];

    return (
        <div className="group h-full overflow-hidden">
            <div
                className={`flex flex-col group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
                    direction === "up"
                        ? "animate-marquee-up"
                        : "animate-marquee-down"
                }`}
            >
                {loop.map((p, i) => {
                    const idx = i % base.length;

                    return (
                        <div key={`${p.posisi}-${i}`} className="pb-3 sm:pb-4">
                            <img
                                src={p.url}
                                alt={i < base.length ? (p.alt ?? "") : ""}
                                aria-hidden={i >= base.length}
                                onError={hideBroken}
                                className={`w-full rounded-3xl bg-indigo-100 object-cover shadow-xl ${
                                    idx % 2 === 0
                                        ? "h-52 sm:h-60"
                                        : "h-64 sm:h-72"
                                }`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Welcome({
    faculty = DEFAULT_FACULTY,
    heroPhotos = DEFAULT_HERO_PHOTOS,
    stats = DEFAULT_STATS,
    programs: programsProp = DEFAULT_PROGRAMS,
    services: servicesProp = DEFAULT_SERVICES,
    news = DEFAULT_NEWS,
    testimonials = DEFAULT_TESTIMONIALS,
}: Props) {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const programs = toPage(programsProp);
    const services = toPage(servicesProp);

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
                                {faculty.university}
                            </p>
                        </Reveal>

                        <Reveal delay={120}>
                            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-indigo-950 sm:text-5xl">
                                {faculty.tagline}
                            </h1>
                        </Reveal>

                        <Reveal delay={240}>
                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                                {faculty.description}
                            </p>
                        </Reveal>

                        <Reveal
                            delay={360}
                            className="mt-8 flex flex-wrap gap-3"
                        >
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

                    {/* Kolase foto: berjalan otomatis atas-bawah */}
                    <Reveal
                        delay={200}
                        className="relative mx-auto w-full max-w-xl lg:max-w-none"
                    >
                        <div className="grid h-[30rem] grid-cols-2 gap-3 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:h-[34rem] sm:gap-4 lg:h-[36rem]">
                            <MarqueeColumn
                                direction="up"
                                photos={heroPhotos.filter(
                                    (_, i) => i % 2 === 0,
                                )}
                            />
                            <MarqueeColumn
                                direction="down"
                                photos={heroPhotos.filter(
                                    (_, i) => i % 2 === 1,
                                )}
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ============ STATISTIK ============ */}
            <section
                aria-label="Angka fakultas"
                className="relative z-10 -mt-12 pb-20 lg:-mt-16"
            >
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {stats.map((s, i) => {
                        return (
                            <Reveal
                                key={s.id}
                                delay={i * 110}
                                className="h-full"
                            >
                                <article className="flex h-full flex-col items-start rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-indigo-900/5">
                                    {s.image ? (
                                        <img
                                            src={s.image}
                                            alt=""
                                            onError={hideBroken}
                                            className="h-12 w-12 rounded-2xl bg-indigo-100 object-cover"
                                        />
                                    ) : (
                                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
                                            <Building2 className="h-6 w-6" />
                                        </span>
                                    )}

                                    <p className="mt-5 text-4xl font-extrabold text-indigo-950">
                                        <AnimatedNumber value={s.value} />
                                        {s.suffix}
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        {s.label}
                                    </p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* ============ VISI & MISI ============ */}
            <section
                id="visi-misi"
                className="relative overflow-hidden bg-white py-20 lg:py-28"
            >
                <Blob className="-right-24 top-0 h-80 w-80 bg-gradient-to-br from-sky-200/60 to-indigo-200/40" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:gap-14 lg:px-8">
                    <div className="lg:col-span-2">
                        <SectionHeading
                            title="Visi dan misi"
                            text="Arah yang kami tuju dan cara kami mencapainya."
                        />
                        <Reveal delay={120} className="mt-8">
                            <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-500 p-8 text-white shadow-xl shadow-indigo-600/20">
                                <h3 className="text-lg font-bold text-indigo-100">
                                    Visi
                                </h3>
                                <p className="mt-3 text-xl font-medium leading-relaxed">
                                    {faculty.vision}
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-3">
                        <Reveal>
                            <h3 className="mb-5 text-xl font-bold text-indigo-950">
                                Misi
                            </h3>
                        </Reveal>
                        <ul className="space-y-3">
                            {faculty.missions.map((m, i) => (
                                <Reveal as="li" key={i} delay={i * 110}>
                                    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-700">
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                        <p className="leading-relaxed text-slate-700">
                                            {m}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ============ PROGRAM STUDI ============ */}
            <section
                id="prodi"
                className="relative overflow-hidden py-20 lg:py-28"
            >
                <Blob className="-left-24 top-20 h-96 w-96 bg-gradient-to-br from-teal-200/50 to-sky-200/40" />
                <Blob className="bottom-0 right-0 h-80 w-80 bg-gradient-to-br from-amber-200/50 to-rose-100/40" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="Program studi"
                        text="Pilih jalur belajar yang sesuai dengan minat dan rencana kariermu."
                    />

                    <div
                        className={`mt-12 grid gap-6 sm:grid-cols-2 ${
                            programs.data.length > 2 ? "lg:grid-cols-3" : ""
                        }`}
                    >
                        {programs.data.map((p, i) => (
                            <Reveal
                                key={p.id}
                                delay={stagger(i)}
                                className="h-full"
                            >
                                <Link
                                    href={`/prodi/${p.slug}`}
                                    className="group flex h-full flex-col rounded-3xl border border-white bg-white/80 p-7 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-sm font-semibold text-indigo-700">
                                            {p.degree}
                                        </span>
                                        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800">
                                            Akreditasi {p.accreditation}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-xl font-bold text-indigo-950">
                                        {p.name}
                                    </h3>
                                    <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                                        {p.description}
                                    </p>
                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                                        <span className="flex items-center gap-1.5 text-slate-500">
                                            <Users className="h-4 w-4" />
                                            {formatNumber(p.student_count)}{" "}
                                            mahasiswa
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
                        onChange={(page) =>
                            goToPage("prodi_page", "programs", page)
                        }
                    />
                </div>
            </section>

            {/* ============ LAYANAN ============ */}
            <section
                id="layanan"
                className="relative overflow-hidden bg-gradient-to-b from-indigo-950 to-indigo-900 py-20 lg:py-28"
            >
                <Blob className="-left-20 top-10 h-96 w-96 bg-gradient-to-br from-indigo-500/40 to-sky-400/20" />
                <Blob className="-right-20 bottom-0 h-96 w-96 bg-gradient-to-br from-teal-400/30 to-emerald-300/10" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Layanan fakultas
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-indigo-200">
                            Urusan akademik dan fasilitas yang bisa kamu akses
                            kapan saja.
                        </p>
                    </Reveal>

                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {services.data.map((s, i) => {
                            const Icon = ICONS[s.icon] ?? Building2;
                            return (
                                <Reveal
                                    key={s.id}
                                    delay={stagger(i)}
                                    className="h-full"
                                >
                                    <article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:bg-white/10">
                                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-sky-400 text-indigo-950">
                                            <Icon className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-lg font-bold text-white">
                                            {s.title}
                                        </h3>
                                        <p className="mt-2 flex-1 leading-relaxed text-indigo-200">
                                            {s.description}
                                        </p>
                                        <ServiceLink url={s.url} />
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
                        onChange={(page) =>
                            goToPage("layanan_page", "services", page)
                        }
                    />
                </div>
            </section>

            {/* ============ BERITA ============ */}
            <section
                id="berita"
                className="relative overflow-hidden py-20 lg:py-28"
            >
                <Blob className="right-0 top-10 h-80 w-80 bg-gradient-to-br from-sky-200/60 to-teal-200/30" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <SectionHeading
                            title="Berita terbaru"
                            text="Kabar prestasi, kegiatan, dan kerja sama dari fakultas."
                        />

                        <Reveal delay={150}>
                            <Link
                                href="/berita"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                            >
                                Semua berita
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Reveal>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {news.map((n, i) => (
                            <Reveal
                                key={n.id}
                                delay={stagger(i)}
                                className="h-full"
                            >
                                <Link
                                    href={`/berita/${n.slug}`}
                                    className="group block h-full overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/5"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                        <img
                                            src={n.image}
                                            alt={n.title}
                                            onError={hideBroken}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-2.5 py-1 text-sm font-semibold text-indigo-700 backdrop-blur">
                                            {n.category}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <p className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(n.published_at)}
                                        </p>

                                        <h3 className="mt-3 text-lg font-bold leading-snug text-indigo-950 transition group-hover:text-indigo-700">
                                            {n.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 leading-relaxed text-slate-600">
                                            {n.excerpt}
                                        </p>

                                        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-700">
                                            Baca selengkapnya
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ KOMENTAR ALUMNI ============ */}
            {current && (
                <section
                    id="alumni"
                    className="relative overflow-hidden bg-white py-20 lg:py-28"
                >
                    <Blob className="-left-20 bottom-0 h-96 w-96 bg-gradient-to-br from-amber-200/50 to-teal-200/40" />
                    <Blob className="-right-24 top-0 h-80 w-80 bg-gradient-to-br from-indigo-200/60 to-sky-200/40" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            center
                            title="Kata alumni"
                            text="Cerita lulusan yang sudah bekerja dan berwirausaha."
                        />

                        <div className="mx-auto mt-12 max-w-3xl">
                            <Reveal delay={100}>
                                <figure
                                    key={current.id}
                                    className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-indigo-900/5 backdrop-blur sm:p-10"
                                >
                                    <Quote className="h-8 w-8 text-teal-500" />
                                    <blockquote className="mt-4 text-xl leading-relaxed text-slate-800 sm:text-2xl">
                                        {current.quote}
                                    </blockquote>
                                    <figcaption className="mt-8 flex items-center gap-4">
                                        <Avatar
                                            src={current.photo}
                                            name={current.name}
                                            className="h-14 w-14 shrink-0 rounded-full bg-indigo-100 ring-4 ring-indigo-100"
                                        />
                                        <div>
                                            <p className="font-bold text-indigo-950">
                                                {current.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {current.job}, {current.company}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {current.batch}
                                            </p>
                                        </div>
                                    </figcaption>
                                </figure>
                            </Reveal>

                            <Reveal delay={220}>
                                <div
                                    className="mt-6 flex justify-center gap-3"
                                    role="tablist"
                                    aria-label="Pilih testimoni"
                                >
                                    {testimonials.map((t, i) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={
                                                i === activeTestimonial
                                            }
                                            aria-label={`Testimoni ${t.name}`}
                                            onClick={() =>
                                                setActiveTestimonial(i)
                                            }
                                            className={`h-14 w-14 overflow-hidden rounded-full bg-indigo-100 ring-2 transition ${
                                                i === activeTestimonial
                                                    ? "scale-110 ring-indigo-600"
                                                    : "opacity-60 ring-transparent hover:opacity-100"
                                            }`}
                                        >
                                            <Avatar
                                                src={t.photo}
                                                name={t.name}
                                                alt=""
                                                className="h-full w-full bg-indigo-100"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>
            )}

            {/* ============ LOKASI ============ */}
            <section
                id="lokasi"
                className="relative overflow-hidden py-20 lg:py-28"
            >
                <Blob className="-left-24 top-10 h-80 w-80 bg-gradient-to-br from-teal-200/50 to-sky-200/40" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="Lokasi kampus"
                        text="Kunjungi kami langsung atau hubungi untuk informasi lebih lanjut."
                    />

                    <div className="mt-12 grid gap-6 lg:grid-cols-5">
                        <Reveal className="lg:col-span-2">
                            <div className="flex h-full flex-col gap-5 rounded-3xl border border-slate-200 bg-white/80 p-7 backdrop-blur">
                                <div className="flex gap-4">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-700">
                                        <MapPin className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="font-bold text-indigo-950">
                                            Alamat
                                        </p>
                                        <p className="mt-1 text-slate-600">
                                            {faculty.university}
                                        </p>
                                        <p className="text-slate-600">
                                            {faculty.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="font-bold text-indigo-950">
                                            Email
                                        </p>
                                        <a
                                            href={`mailto:${faculty.email}`}
                                            className="mt-1 block text-slate-600 hover:text-indigo-700"
                                        >
                                            {faculty.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                                        <Phone className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="font-bold text-indigo-950">
                                            Telepon
                                        </p>
                                        <p className="mt-1 text-slate-600">
                                            {faculty.phone}
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href={MAP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
                                >
                                    Buka di Google Maps
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </Reveal>

                        <Reveal delay={150} className="lg:col-span-3">
                            <div className="h-full min-h-[22rem] overflow-hidden rounded-3xl border border-slate-200 shadow-lg shadow-indigo-900/5">
                                <iframe
                                    title="Peta lokasi Universitas Al-Khairiyah"
                                    src={MAP_EMBED}
                                    className="h-full min-h-[22rem] w-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
