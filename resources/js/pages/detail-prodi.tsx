import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    Award,
    BookOpen,
    Briefcase,
    Building2,
    CheckCircle2,
    ChevronRight,
    Clock,
    GraduationCap,
    Mail,
    Phone,
    Users,
    type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import Blob from "@/components/blob";
import Reveal from "@/components/reveal";
import PublicLayout from "@/layouts/public-layout";

/* ------------------------------------------------------------------ */
/*  TYPES — sesuai kolom tabel `programs`                               */
/* ------------------------------------------------------------------ */

type Semester = { semester: number; courses: string[] };

type ProgramDetail = {
    id: number;
    slug: string;
    name: string;
    degree: string;
    accreditation: string;
    description: string;
    student_count: number;
    hero_image: string | null;
    overview: string | null;
    vision: string | null;
    duration: string | null;
    credits: number | null;
    head_name: string | null;
    head_title: string | null;
    head_photo: string | null;
    competencies: string[] | null;
    curriculum: Semester[] | null;
    career_prospects: string[] | null;
    facilities: string[] | null;
    admission_requirements: string[] | null;
    contact_email: string | null;
    contact_phone: string | null;
};

type RelatedProgram = Pick<
    ProgramDetail,
    | "id"
    | "slug"
    | "name"
    | "degree"
    | "accreditation"
    | "description"
    | "student_count"
>;

type Props = {
    program: ProgramDetail;
    related?: RelatedProgram[];
};

const formatNumber = (n: number) => n.toLocaleString("id-ID");

function Heading({ title, text }: { title: string; text?: string }) {
    return (
        <Reveal className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl">
                {title}
            </h2>
            {text && <p className="mt-2 text-slate-600">{text}</p>}
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  HALAMAN                                                             */
/* ------------------------------------------------------------------ */

export default function DetailProdi({ program, related = [] }: Props) {
    const competencies = program.competencies ?? [];
    const curriculum = program.curriculum ?? [];
    const careers = program.career_prospects ?? [];
    const facilities = program.facilities ?? [];
    const requirements = program.admission_requirements ?? [];

    const [activeSemester, setActiveSemester] = useState(0);
    const semester = curriculum[activeSemester];

    const facts: { icon: LucideIcon; label: string; value: string }[] = [
        program.duration
            ? { icon: Clock, label: "Lama studi", value: program.duration }
            : null,
        program.credits
            ? {
                  icon: BookOpen,
                  label: "Beban studi",
                  value: `${program.credits} SKS`,
              }
            : null,
        {
            icon: Users,
            label: "Mahasiswa aktif",
            value: formatNumber(program.student_count),
        },
        { icon: Award, label: "Akreditasi", value: program.accreditation },
    ].filter(
        (f): f is { icon: LucideIcon; label: string; value: string } =>
            f !== null,
    );

    return (
        <PublicLayout>
            <Head title={`Program Studi ${program.name}`} />

            {/* ============ HERO ============ */}
            <section className="relative overflow-hidden">
                <Blob className="-left-32 -top-24 h-[26rem] w-[26rem] bg-gradient-to-br from-indigo-400/50 to-sky-300/40" />
                <Blob className="right-[-8rem] top-10 h-[28rem] w-[28rem] bg-gradient-to-br from-teal-300/50 to-emerald-200/40" />
                <Blob className="bottom-[-6rem] left-1/3 h-64 w-64 bg-gradient-to-br from-amber-200/60 to-orange-200/30" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-28 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pb-32 lg:pt-36">
                    <div>
                        <Reveal>
                            <nav
                                aria-label="Breadcrumb"
                                className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
                            >
                                <a
                                    href="/#beranda"
                                    className="hover:text-indigo-700"
                                >
                                    Beranda
                                </a>
                                <ChevronRight className="h-3.5 w-3.5" />
                                <a
                                    href="/#prodi"
                                    className="hover:text-indigo-700"
                                >
                                    Program studi
                                </a>
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="font-medium text-indigo-900">
                                    {program.name}
                                </span>
                            </nav>
                        </Reveal>

                        <Reveal
                            delay={100}
                            className="mt-6 flex flex-wrap gap-2"
                        >
                            <span className="rounded-lg bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                                {program.degree}
                            </span>
                            <span className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                                Akreditasi {program.accreditation}
                            </span>
                        </Reveal>

                        <Reveal delay={200}>
                            <h1 className="mt-5 break-words text-4xl font-extrabold leading-[1.15] tracking-tight text-indigo-950 sm:text-5xl">
                                {program.name}
                            </h1>
                        </Reveal>

                        <Reveal delay={300}>
                            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                                {program.description}
                            </p>
                        </Reveal>

                        <Reveal
                            delay={400}
                            className="mt-8 flex flex-wrap gap-3"
                        >
                            {curriculum.length > 0 && (
                                <a
                                    href="#kurikulum"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800 sm:w-auto"
                                >
                                    Lihat kurikulum
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            )}
                            {program.contact_email && (
                                <a
                                    href={`mailto:${program.contact_email}`}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-indigo-300 hover:text-indigo-700 sm:w-auto"
                                >
                                    Hubungi program studi
                                </a>
                            )}
                        </Reveal>
                    </div>

                    <Reveal delay={250}>
                        {program.hero_image ? (
                            <img
                                src={program.hero_image}
                                alt={`Kegiatan mahasiswa ${program.name}`}
                                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
                            />
                        ) : (
                            <div className="grid aspect-[4/3] w-full place-items-center rounded-3xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white shadow-xl">
                                <GraduationCap className="h-16 w-16" />
                            </div>
                        )}
                    </Reveal>
                </div>
            </section>

            {/* ============ FAKTA SINGKAT ============ */}
            <section
                aria-label="Fakta singkat"
                className="relative z-10 -mt-14 lg:-mt-16"
            >
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {facts.map((f, i) => (
                        <Reveal
                            key={f.label}
                            delay={i * 100}
                            className="h-full"
                        >
                            {/* Ikon di atas teks pada layar kecil, supaya teks tidak terjepit */}
                            <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5">
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-100 to-teal-100 text-indigo-700 sm:h-12 sm:w-12">
                                    <f.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </span>
                                <div className="min-w-0">
                                    <p className="break-words text-base font-bold leading-tight text-indigo-950 sm:text-lg">
                                        {f.value}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {f.label}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ============ ISI UTAMA ============ */}
            <section className="py-16 lg:py-24">
                <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                    <div className="min-w-0 space-y-16 lg:col-span-2">
                        {/* Tentang & visi */}
                        <div>
                            <Heading title="Tentang program studi" />
                            <Reveal delay={80}>
                                <p className="whitespace-pre-line text-base leading-relaxed text-slate-700">
                                    {program.overview ?? program.description}
                                </p>
                            </Reveal>
                            {program.vision && (
                                <Reveal delay={160} className="mt-8">
                                    <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-500 p-7 text-white shadow-xl shadow-indigo-600/20">
                                        <h3 className="text-base font-bold text-indigo-100">
                                            Visi program studi
                                        </h3>
                                        <p className="mt-2 text-lg font-medium leading-relaxed">
                                            {program.vision}
                                        </p>
                                    </div>
                                </Reveal>
                            )}
                        </div>

                        {/* Kompetensi */}
                        {competencies.length > 0 && (
                            <div>
                                <Heading
                                    title="Kompetensi lulusan"
                                    text="Kemampuan yang akan kamu kuasai saat lulus."
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {competencies.map((c, i) => (
                                        <Reveal
                                            key={c}
                                            delay={(i % 2) * 100}
                                            className="h-full"
                                        >
                                            <div className="flex h-full gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                                                <p className="leading-relaxed text-slate-700">
                                                    {c}
                                                </p>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Kurikulum */}
                        {curriculum.length > 0 && (
                            <div id="kurikulum" className="scroll-mt-24">
                                <Heading
                                    title="Kurikulum"
                                    text="Pilih semester untuk melihat mata kuliahnya."
                                />
                                <Reveal delay={80}>
                                    <div
                                        role="tablist"
                                        aria-label="Pilih semester"
                                        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
                                    >
                                        {curriculum.map((s, i) => (
                                            <button
                                                key={s.semester}
                                                type="button"
                                                role="tab"
                                                aria-selected={
                                                    i === activeSemester
                                                }
                                                onClick={() =>
                                                    setActiveSemester(i)
                                                }
                                                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                                    i === activeSemester
                                                        ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20"
                                                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                                                }`}
                                            >
                                                Semester {s.semester}
                                            </button>
                                        ))}
                                    </div>

                                    {semester && (
                                        <ul
                                            key={semester.semester}
                                            role="tabpanel"
                                            className="mt-4 grid gap-3 sm:grid-cols-2"
                                        >
                                            {semester.courses.map((course) => (
                                                <li
                                                    key={course}
                                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                                                >
                                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                                                        <BookOpen className="h-4 w-4" />
                                                    </span>
                                                    <span className="min-w-0 break-words font-medium text-slate-700">
                                                        {course}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Reveal>
                            </div>
                        )}

                        {/* Prospek karier */}
                        {careers.length > 0 && (
                            <div>
                                <Heading
                                    title="Prospek karier"
                                    text="Jalur kerja yang biasa ditempuh lulusan."
                                />
                                <Reveal
                                    delay={80}
                                    className="flex flex-wrap gap-3"
                                >
                                    {careers.map((c) => (
                                        <span
                                            key={c}
                                            className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-900"
                                        >
                                            <Briefcase className="h-4 w-4 shrink-0 text-teal-600" />
                                            {c}
                                        </span>
                                    ))}
                                </Reveal>
                            </div>
                        )}

                        {/* Fasilitas */}
                        {facilities.length > 0 && (
                            <div>
                                <Heading title="Fasilitas" />
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {facilities.map((f, i) => (
                                        <Reveal
                                            key={f}
                                            delay={i * 100}
                                            className="h-full"
                                        >
                                            <div className="h-full rounded-2xl border border-slate-200 bg-white p-5">
                                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-sky-400 text-indigo-950">
                                                    <Building2 className="h-5 w-5" />
                                                </span>
                                                <p className="mt-4 leading-relaxed text-slate-700">
                                                    {f}
                                                </p>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ===== Kolom samping ===== */}
                    <aside className="min-w-0 space-y-6 self-start lg:sticky lg:top-24">
                        {program.head_name && (
                            <Reveal>
                                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                                    <h3 className="font-bold text-indigo-950">
                                        Ketua program studi
                                    </h3>
                                    <div className="mt-4 flex items-center gap-4">
                                        {program.head_photo ? (
                                            <img
                                                src={program.head_photo}
                                                alt={program.head_name}
                                                className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-indigo-100"
                                            />
                                        ) : (
                                            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-indigo-100 text-indigo-600">
                                                <GraduationCap className="h-7 w-7" />
                                            </span>
                                        )}
                                        <div className="min-w-0">
                                            <p className="break-words font-semibold text-slate-800">
                                                {program.head_name}
                                            </p>
                                            {program.head_title && (
                                                <p className="text-sm text-slate-500">
                                                    {program.head_title}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        <Reveal delay={120}>
                            <div className="rounded-3xl bg-gradient-to-b from-indigo-950 to-indigo-900 p-6 text-indigo-100">
                                <h3 className="text-lg font-bold text-white">
                                    Informasi pendaftaran
                                </h3>

                                {requirements.length > 0 && (
                                    <ul className="mt-4 space-y-3 text-sm">
                                        {requirements.map((r) => (
                                            <li key={r} className="flex gap-3">
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                                <span className="leading-relaxed">
                                                    {r}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {(program.contact_email ||
                                    program.contact_phone) && (
                                    <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm">
                                        {program.contact_email && (
                                            <a
                                                href={`mailto:${program.contact_email}`}
                                                className="flex items-center gap-3 hover:text-white"
                                            >
                                                <Mail className="h-4 w-4 shrink-0 text-teal-300" />
                                                <span className="break-all">
                                                    {program.contact_email}
                                                </span>
                                            </a>
                                        )}
                                        {program.contact_phone && (
                                            <a
                                                href={`tel:${program.contact_phone.replace(/[^\d+]/g, "")}`}
                                                className="flex items-center gap-3 hover:text-white"
                                            >
                                                <Phone className="h-4 w-4 shrink-0 text-teal-300" />
                                                {program.contact_phone}
                                            </a>
                                        )}
                                    </div>
                                )}

                                {program.contact_email && (
                                    <a
                                        href={`mailto:${program.contact_email}`}
                                        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                                    >
                                        Tanya program studi
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    </aside>
                </div>
            </section>

            {/* ============ PROGRAM STUDI LAIN ============ */}
            {related.length > 0 && (
                <section className="relative overflow-hidden bg-white py-16 lg:py-24">
                    <Blob className="-right-24 top-0 h-80 w-80 bg-gradient-to-br from-sky-200/60 to-indigo-200/40" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <Heading
                                title="Program studi lainnya"
                                text="Bandingkan dengan jalur belajar lain di fakultas ini."
                            />
                            <Reveal delay={120} className="mb-6">
                                <a
                                    href="/#prodi"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                                >
                                    Semua program studi
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </Reveal>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((p, i) => (
                                <Reveal
                                    key={p.id}
                                    delay={(i % 3) * 110}
                                    className="h-full"
                                >
                                    <Link
                                        href={`/prodi/${p.slug}`}
                                        className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50/60 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-900/5"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-sm font-semibold text-indigo-700">
                                                {p.degree}
                                            </span>
                                            <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800">
                                                Akreditasi {p.accreditation}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-lg font-bold text-indigo-950">
                                            {p.name}
                                        </h3>
                                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                                            {p.description}
                                        </p>
                                        <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-700">
                                            Selengkapnya
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
