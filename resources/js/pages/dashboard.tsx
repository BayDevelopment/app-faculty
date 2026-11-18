import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowRight,
    ExternalLink,
    GraduationCap,
    Handshake,
    MessageSquareQuote,
    Newspaper,
    Quote,
    ShieldAlert,
    ShieldCheck,
    Users,
    type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import Blob from "@/components/blob";
import Reveal from "@/components/reveal";
import { dashboard } from "@/routes";

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

type Total = { total: number; active: number };

type Props = {
    faculty: {
        id: number;
        name: string;
        university: string;
        tagline: string;
        email: string;
        phone: string;
        updated_at: string;
    } | null;
    counts: {
        programs: Total;
        services: Total;
        news: { total: number; published: number; draft: number };
        testimonials: Total;
        stats: Total;
        students: number;
    };
    programCompleteness: {
        complete: number;
        total: number;
        incomplete: { id: number; name: string; degree: string }[];
    };
    programsByDegree: {
        degree: string;
        total: number;
        students: number | null;
    }[];
    programsByAccreditation: { accreditation: string; total: number }[];
    newsByCategory: { category: string; total: number }[];
    latestNews: {
        id: number;
        title: string;
        category: string;
        is_published: boolean;
        published_at: string | null;
        created_at: string;
    }[];
    latestTestimonials: {
        id: number;
        name: string;
        batch: string;
        job: string;
        company: string;
        quote: string;
        photo: string | null;
    }[];
    stats: {
        id: number;
        label: string;
        value: number;
        suffix: string | null;
    }[];
    security: { twoFactorEnabled: boolean; emailVerified: boolean };
    trends: {
        programs: number[];
        services: number[];
        news: number[];
        testimonials: number[];
        studentsByProgram: { name: string; value: number }[];
    };
};

/* ------------------------------------------------------------------ */
/*  STYLE & HELPER                                                      */
/* ------------------------------------------------------------------ */

const card =
    "rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-indigo-900/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none";
const titleCls = "text-lg font-bold text-indigo-950 dark:text-white";
const mutedCls = "text-sm text-slate-500 dark:text-slate-400";
const bodyCls = "text-slate-600 dark:text-slate-300";

const tones = {
    indigo: {
        chip: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
        chart: "text-indigo-600 dark:text-indigo-400",
    },
    teal: {
        chip: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
        chart: "text-teal-600 dark:text-teal-400",
    },
    amber: {
        chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        chart: "text-amber-500 dark:text-amber-400",
    },
    sky: {
        chip: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
        chart: "text-sky-600 dark:text-sky-400",
    },
    rose: {
        chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
        chart: "text-rose-500 dark:text-rose-400",
    },
} as const;

type Tone = keyof typeof tones;

const nf = new Intl.NumberFormat("id-ID");

const formatDate = (iso: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "-";

const greeting = () => {
    const h = new Date().getHours();

    if (h < 11) return "pagi";
    if (h < 15) return "siang";
    if (h < 18) return "sore";

    return "malam";
};

/** Jeda bergilir per kolom, sama seperti di landing page. */
const stagger = (i: number, cols = 3) => (i % cols) * 110;

const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = "hidden";
};

/* ------------------------------------------------------------------ */
/*  KOMPONEN KECIL                                                      */
/* ------------------------------------------------------------------ */

function Sparkline({ data, tone }: { data: number[]; tone: Tone }) {
    const w = 120;
    const h = 36;
    const pad = 3;

    if (data.length < 2) {
        return null;
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    const points = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y =
            range === 0 ? h / 2 : h - pad - ((v - min) / range) * (h - pad * 2);

        return [x, y] as const;
    });

    const line = points.map(([x, y]) => `${x},${y}`).join(" ");
    const area = `${pad},${h} ${line} ${w - pad},${h}`;
    const [lastX, lastY] = points[points.length - 1];

    return (
        <svg
            viewBox={`0 0 ${w} ${h}`}
            className={`h-10 w-full ${tones[tone].chart}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Tren 6 bulan terakhir"
        >
            <polygon points={area} fill="currentColor" opacity={0.14} />
            <polyline
                points={line}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
            <circle cx={lastX} cy={lastY} r={3} fill="currentColor" />
        </svg>
    );
}

function MiniBars({
    data,
    tone,
}: {
    data: { name: string; value: number }[];
    tone: Tone;
}) {
    const max = Math.max(1, ...data.map((d) => d.value));

    return (
        <div
            className={`flex h-10 items-end gap-1 ${tones[tone].chart}`}
            role="img"
            aria-label="Mahasiswa per program"
        >
            {data.map((d) => (
                <div
                    key={d.name}
                    title={`${d.name}: ${nf.format(d.value)}`}
                    className="flex-1 rounded-md bg-current opacity-60 transition hover:opacity-100"
                    style={{
                        height: `${Math.max(12, (d.value / max) * 100)}%`,
                    }}
                />
            ))}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    hint,
    icon: Icon,
    tone,
    chart,
    delay,
}: {
    label: string;
    value: number;
    hint: string;
    icon: LucideIcon;
    tone: Tone;
    chart?: ReactNode;
    delay: number;
}) {
    return (
        <Reveal delay={delay} className="h-full">
            <article
                className={`${card} flex flex-col transition hover:-translate-y-1 hover:shadow-xl`}
            >
                <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[tone].chip}`}
                >
                    <Icon className="h-6 w-6" />
                </span>
                <p className="mt-5 text-4xl font-extrabold tabular-nums text-indigo-950 dark:text-white">
                    {nf.format(value)}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}
                </p>
                <p className={`${mutedCls} mb-4`}>{hint}</p>
                <div className="mt-auto">{chart}</div>
            </article>
        </Reveal>
    );
}

function BarRow({
    label,
    value,
    max,
}: {
    label: string;
    value: number;
    max: number;
}) {
    const width = max ? Math.round((value / max) * 100) : 0;

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
                <span className={bodyCls}>{label}</span>
                <span className="font-bold tabular-nums text-indigo-950 dark:text-white">
                    {value}
                </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-teal-400 transition-all duration-700"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

function CardHeading({ title, text }: { title: string; text?: string }) {
    return (
        <div className="mb-5">
            <h2 className={titleCls}>{title}</h2>
            {text && <p className={`${mutedCls} mt-0.5`}>{text}</p>}
        </div>
    );
}

function Pill({
    children,
    color = "indigo",
}: {
    children: ReactNode;
    color?: "indigo" | "teal" | "amber";
}) {
    const map = {
        indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
        teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
        amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    };

    return (
        <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${map[color]}`}
        >
            {children}
        </span>
    );
}

function Avatar({ name, photo }: { name: string; photo: string | null }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return photo ? (
        <img
            src={photo}
            alt={name}
            onError={hideBroken}
            className="h-12 w-12 shrink-0 rounded-full bg-indigo-100 object-cover ring-4 ring-indigo-100 dark:ring-indigo-500/20"
        />
    ) : (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-500/10">
            {initials}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  HALAMAN                                                             */
/* ------------------------------------------------------------------ */

export default function Dashboard({
    faculty,
    counts,
    programCompleteness,
    programsByDegree,
    programsByAccreditation,
    newsByCategory,
    latestNews,
    latestTestimonials,
    stats,
    security,
    trends,
}: Props) {
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;
    const firstName = auth?.user?.name?.split(" ")[0];

    const completion = programCompleteness.total
        ? Math.round(
              (programCompleteness.complete / programCompleteness.total) * 100,
          )
        : 0;

    const maxDegree = Math.max(0, ...programsByDegree.map((d) => d.total));
    const maxAccreditation = Math.max(
        0,
        ...programsByAccreditation.map((a) => a.total),
    );
    const maxCategory = Math.max(0, ...newsByCategory.map((c) => c.total));

    return (
        <>
            <Head title="Dashboard" />

            <div className="relative flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-4 md:p-6">
                {/* dekorasi latar */}
                <Blob className="-left-24 top-40 h-80 w-80 bg-gradient-to-br from-indigo-300/40 to-sky-200/30 dark:from-indigo-500/15 dark:to-sky-400/5" />
                <Blob className="-right-24 top-[28rem] h-96 w-96 bg-gradient-to-br from-teal-200/50 to-emerald-100/30 dark:from-teal-400/10 dark:to-emerald-300/5" />
                <Blob className="bottom-0 left-1/3 h-72 w-72 bg-gradient-to-br from-amber-200/50 to-orange-100/20 dark:from-amber-400/10 dark:to-orange-300/0" />

                {/* ============ BANNER ============ */}
                <Reveal className="relative">
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-500 p-7 text-white shadow-xl shadow-indigo-600/20 sm:p-10">
                        <Blob className="-right-16 -top-20 h-72 w-72 bg-white/15" />
                        <Blob className="-bottom-24 left-1/4 h-64 w-64 bg-amber-200/20" />

                        <div className="relative max-w-2xl">
                            {faculty && (
                                <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
                                    <span className="h-2 w-2 rounded-full bg-teal-300" />
                                    {faculty.university}
                                </p>
                            )}

                            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                Selamat {greeting()}
                                {firstName ? `, ${firstName}` : ""}
                            </h1>

                            <p className="mt-3 max-w-xl text-base leading-relaxed text-indigo-100">
                                {faculty
                                    ? `Kelola konten ${faculty.name}: ${faculty.tagline}`
                                    : "Kelola konten website fakultas dari sini."}
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                                >
                                    Lihat website
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
                                >
                                    Halaman berita
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </Reveal>

                {/* ============ KARTU RINGKASAN ============ */}
                <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <SummaryCard
                        label="Program Studi"
                        value={counts.programs.total}
                        hint={`${counts.programs.active} aktif`}
                        icon={GraduationCap}
                        tone="indigo"
                        chart={
                            <Sparkline data={trends.programs} tone="indigo" />
                        }
                        delay={0}
                    />
                    <SummaryCard
                        label="Mahasiswa"
                        value={counts.students}
                        hint="Dari program aktif"
                        icon={Users}
                        tone="teal"
                        chart={
                            <MiniBars
                                data={trends.studentsByProgram}
                                tone="teal"
                            />
                        }
                        delay={110}
                    />
                    <SummaryCard
                        label="Layanan"
                        value={counts.services.total}
                        hint={`${counts.services.active} aktif`}
                        icon={Handshake}
                        tone="amber"
                        chart={
                            <Sparkline data={trends.services} tone="amber" />
                        }
                        delay={220}
                    />
                    <SummaryCard
                        label="Berita"
                        value={counts.news.total}
                        hint={`${counts.news.published} terbit · ${counts.news.draft} draft`}
                        icon={Newspaper}
                        tone="sky"
                        chart={<Sparkline data={trends.news} tone="sky" />}
                        delay={330}
                    />
                    <SummaryCard
                        label="Testimoni"
                        value={counts.testimonials.total}
                        hint={`${counts.testimonials.active} aktif`}
                        icon={MessageSquareQuote}
                        tone="rose"
                        chart={
                            <Sparkline data={trends.testimonials} tone="rose" />
                        }
                        delay={440}
                    />
                </div>

                {/* ============ BERITA + KEAMANAN ============ */}
                <div className="relative grid gap-4 lg:grid-cols-3">
                    <Reveal className="lg:col-span-2">
                        <section className={card}>
                            <CardHeading
                                title="Berita terbaru"
                                text="5 berita terakhir yang dibuat"
                            />

                            {latestNews.length === 0 ? (
                                <p className={mutedCls}>Belum ada berita.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {latestNews.map((n) => (
                                        <li
                                            key={n.id}
                                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-indigo-950 dark:text-white">
                                                    {n.title}
                                                </p>

                                                <p className={mutedCls}>
                                                    {n.category} ·{" "}
                                                    {formatDate(
                                                        n.published_at ??
                                                            n.created_at,
                                                    )}
                                                </p>
                                            </div>

                                            <Pill
                                                color={
                                                    n.is_published
                                                        ? "teal"
                                                        : "amber"
                                                }
                                            >
                                                {n.is_published
                                                    ? "Terbit"
                                                    : "Draft"}
                                            </Pill>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </Reveal>

                    <Reveal delay={150}>
                        <section className={card}>
                            <CardHeading
                                title="Keamanan akun"
                                text="Perlindungan login admin"
                            />

                            <div className="space-y-3">
                                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                    <span
                                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                                            security.twoFactorEnabled
                                                ? tones.teal.chip
                                                : tones.amber.chip
                                        }`}
                                    >
                                        {security.twoFactorEnabled ? (
                                            <ShieldCheck className="h-5 w-5" />
                                        ) : (
                                            <ShieldAlert className="h-5 w-5" />
                                        )}
                                    </span>

                                    <div className="flex-1">
                                        <p className="font-semibold text-indigo-950 dark:text-white">
                                            Two-factor auth
                                        </p>

                                        <p className={mutedCls}>
                                            {security.twoFactorEnabled
                                                ? "Sudah aktif"
                                                : "Belum diaktifkan"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                    <span
                                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                                            security.emailVerified
                                                ? tones.teal.chip
                                                : tones.amber.chip
                                        }`}
                                    >
                                        {security.emailVerified ? (
                                            <ShieldCheck className="h-5 w-5" />
                                        ) : (
                                            <ShieldAlert className="h-5 w-5" />
                                        )}
                                    </span>

                                    <div className="flex-1">
                                        <p className="font-semibold text-indigo-950 dark:text-white">
                                            Email
                                        </p>

                                        <p className={mutedCls}>
                                            {security.emailVerified
                                                ? "Sudah terverifikasi"
                                                : "Belum terverifikasi"}
                                        </p>
                                    </div>
                                </div>

                                {!security.twoFactorEnabled && (
                                    <Link
                                        href="/settings/two-factor"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
                                    >
                                        Aktifkan sekarang
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </section>
                    </Reveal>
                </div>

                {/* ============ PROGRAM & KATEGORI ============ */}
                <div className="relative grid gap-4 lg:grid-cols-3">
                    <Reveal>
                        <section className={card}>
                            <CardHeading
                                title="Kelengkapan program"
                                text={`${programCompleteness.complete} dari ${programCompleteness.total} program punya detail lengkap`}
                            />

                            <p className="text-4xl font-extrabold tabular-nums text-indigo-950 dark:text-white">
                                {completion}%
                            </p>

                            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-teal-400 transition-all duration-700"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>

                            {programCompleteness.incomplete.length > 0 ? (
                                <div className="mt-5 space-y-2">
                                    <p className={mutedCls}>Perlu dilengkapi</p>

                                    {programCompleteness.incomplete.map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.03]"
                                        >
                                            <span
                                                className={`truncate ${bodyCls}`}
                                            >
                                                {p.name}
                                            </span>

                                            <Pill>{p.degree}</Pill>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={`${mutedCls} mt-5`}>
                                    Semua program sudah lengkap.
                                </p>
                            )}
                        </section>
                    </Reveal>

                    <Reveal delay={110}>
                        <section className={card}>
                            <CardHeading
                                title="Sebaran program"
                                text="Per jenjang dan akreditasi"
                            />

                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Jenjang
                            </p>

                            <div className="space-y-3">
                                {programsByDegree.map((d) => (
                                    <BarRow
                                        key={d.degree}
                                        label={d.degree}
                                        value={d.total}
                                        max={maxDegree}
                                    />
                                ))}
                            </div>

                            <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Akreditasi
                            </p>

                            <div className="space-y-3">
                                {programsByAccreditation.map((a) => (
                                    <BarRow
                                        key={a.accreditation}
                                        label={a.accreditation}
                                        value={a.total}
                                        max={maxAccreditation}
                                    />
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    <Reveal delay={220}>
                        <section className={card}>
                            <CardHeading
                                title="Berita per kategori"
                                text="Distribusi konten berita"
                            />

                            {newsByCategory.length === 0 ? (
                                <p className={mutedCls}>Belum ada data.</p>
                            ) : (
                                <div className="space-y-3">
                                    {newsByCategory.map((c) => (
                                        <BarRow
                                            key={c.category}
                                            label={c.category}
                                            value={c.total}
                                            max={maxCategory}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </Reveal>
                </div>

                {/* ============ STATISTIK + TESTIMONI ============ */}
                <div className="relative grid gap-4 lg:grid-cols-3">
                    <Reveal>
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950 to-indigo-900 p-6 text-white shadow-xl shadow-indigo-950/20">
                            <Blob className="-right-12 -top-12 h-48 w-48 bg-gradient-to-br from-teal-400/30 to-emerald-300/10" />
                            <Blob className="-bottom-16 -left-12 h-48 w-48 bg-gradient-to-br from-indigo-500/40 to-sky-400/20" />

                            <div className="relative">
                                <h2 className="text-lg font-bold">
                                    Statistik di website
                                </h2>
                                <p className="mt-0.5 text-sm text-indigo-200">
                                    {counts.stats.active} dari{" "}
                                    {counts.stats.total} statistik aktif
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    {stats.map((s) => (
                                        <div
                                            key={s.id}
                                            className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur transition hover:bg-white/10"
                                        >
                                            <p className="text-2xl font-extrabold tabular-nums">
                                                {nf.format(s.value)}
                                                {s.suffix}
                                            </p>
                                            <p className="mt-1 text-xs leading-snug text-indigo-200">
                                                {s.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </Reveal>

                    <Reveal delay={150} className="lg:col-span-2">
                        <section className={card}>
                            <CardHeading
                                title="Testimoni terbaru"
                                text="Suara alumni yang tampil di website"
                            />
                            {latestTestimonials.length === 0 ? (
                                <p className={mutedCls}>Belum ada testimoni.</p>
                            ) : (
                                <div className="max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-500/30">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {latestTestimonials.map((t) => (
                                            <figure
                                                key={t.id}
                                                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]"
                                            >
                                                <Quote className="h-6 w-6 text-teal-500" />

                                                <blockquote
                                                    className={`mt-3 line-clamp-3 flex-1 leading-relaxed ${bodyCls}`}
                                                >
                                                    {t.quote}
                                                </blockquote>

                                                <figcaption className="mt-5 flex items-center gap-3">
                                                    <Avatar
                                                        name={t.name}
                                                        photo={t.photo}
                                                    />

                                                    <div className="min-w-0">
                                                        <p className="truncate font-bold text-indigo-950 dark:text-white">
                                                            {t.name}
                                                        </p>

                                                        <p
                                                            className={`truncate ${mutedCls}`}
                                                        >
                                                            {t.job}, {t.company}
                                                        </p>

                                                        <p
                                                            className={`truncate ${mutedCls}`}
                                                        >
                                                            {t.batch}
                                                        </p>
                                                    </div>
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </Reveal>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: "Dashboard",
            href: dashboard(),
        },
    ],
};
