import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    ChevronRight,
    Clock,
    Newspaper,
    Share2,
    Tag,
} from 'lucide-react';

import Blob from '@/components/blob';
import Reveal from '@/components/reveal';
import PublicLayout from '@/layouts/public-layout';

/* ------------------------------------------------------------------ */
/* TYPES                                                              */
/* ------------------------------------------------------------------ */

type News = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    published_at: string;
};

type Props = {
    news: News;
    related?: News[];
};

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

const getReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
};

/* ------------------------------------------------------------------ */
/* HEADING                                                            */
/* ------------------------------------------------------------------ */

function Heading({
    title,
    text,
}: {
    title: string;
    text?: string;
}) {
    return (
        <Reveal className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl">
                {title}
            </h2>

            {text && (
                <p className="mt-2 leading-relaxed text-slate-600">
                    {text}
                </p>
            )}
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function DetailBerita({
    news,
    related = [],
}: Props) {
    return (
        <PublicLayout>
            <Head title={news.title} />

            {/* ====================================================== */}
            {/* HERO BERITA                                            */}
            {/* ====================================================== */}

            <section className="relative overflow-hidden">
                <Blob className="-left-32 -top-24 h-[26rem] w-[26rem] bg-gradient-to-br from-indigo-400/50 to-sky-300/40" />

                <Blob className="right-[-8rem] top-10 h-[28rem] w-[28rem] bg-gradient-to-br from-teal-300/50 to-emerald-200/40" />

                <Blob className="bottom-[-6rem] left-1/3 h-64 w-64 bg-gradient-to-br from-amber-200/60 to-orange-200/30" />

                <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">

                    {/* Breadcrumb */}
                    <Reveal>
                        <nav
                            aria-label="Breadcrumb"
                            className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
                        >
                            <Link
                                href="/#beranda"
                                className="transition hover:text-indigo-700"
                            >
                                Beranda
                            </Link>

                            <ChevronRight className="h-3.5 w-3.5" />

                            <Link
                                href="/berita"
                                className="transition hover:text-indigo-700"
                            >
                                Berita
                            </Link>

                            <ChevronRight className="h-3.5 w-3.5" />

                            <span className="font-medium text-indigo-900">
                                {news.title}
                            </span>
                        </nav>
                    </Reveal>

                    {/* Category */}
                    <Reveal delay={100} className="mt-8">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                            <Tag className="h-4 w-4" />
                            {news.category}
                        </span>
                    </Reveal>

                    {/* Title */}
                    <Reveal delay={180}>
                        <h1 className="mt-5 max-w-5xl text-4xl font-extrabold leading-[1.12] tracking-tight text-indigo-950 sm:text-5xl lg:text-6xl">
                            {news.title}
                        </h1>
                    </Reveal>

                    {/* Meta */}
                    <Reveal delay={260}>
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-indigo-600" />

                                <span>
                                    {formatDate(news.published_at)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-indigo-600" />

                                <span>
                                    ± {getReadingTime(news.excerpt)} menit baca
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ====================================================== */}
            {/* GAMBAR UTAMA                                            */}
            {/* ====================================================== */}

            <section className="relative z-10 -mt-4 pb-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                    <Reveal delay={320}>
                        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/10 ring-1 ring-slate-200">
                            <img
                                src={news.image}
                                alt={news.title}
                                className="aspect-[16/9] w-full object-cover"
                            />
                        </div>
                    </Reveal>

                </div>
            </section>

            {/* ====================================================== */}
            {/* ISI BERITA                                             */}
            {/* ====================================================== */}

            <section className="relative overflow-hidden pb-20 lg:pb-28">
                <Blob className="-left-32 top-20 h-96 w-96 bg-gradient-to-br from-sky-200/40 to-indigo-200/30" />

                <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">

                    {/* =============================== */}
                    {/* ARTIKEL */}
                    {/* =============================== */}

                    <article className="lg:col-span-2">

                        <Reveal>
                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">

                                {/* Lead */}
                                <div className="border-l-4 border-indigo-600 pl-5">
                                    <p className="text-lg font-medium leading-relaxed text-slate-700 sm:text-xl">
                                        {news.excerpt}
                                    </p>
                                </div>

                                {/* Isi sementara */}
                                <div className="mt-8 space-y-6 text-base leading-8 text-slate-700">

                                    <p>
                                        {news.excerpt}
                                    </p>

                                    <p>
                                        Berita ini merupakan informasi terbaru
                                        dari fakultas mengenai kegiatan,
                                        prestasi, kerja sama, maupun berbagai
                                        perkembangan akademik dan kemahasiswaan.
                                    </p>

                                    <p>
                                        Informasi selengkapnya dapat menjadi
                                        bagian dari dokumentasi kegiatan
                                        fakultas serta memberikan informasi
                                        kepada mahasiswa, sivitas akademika,
                                        mitra, dan masyarakat.
                                    </p>

                                </div>

                            </div>
                        </Reveal>

                        {/* Back */}
                        <Reveal delay={120} className="mt-8">
                            <Link
                                href="/berita"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke berita
                            </Link>
                        </Reveal>

                    </article>

                    {/* =============================== */}
                    {/* SIDEBAR */}
                    {/* =============================== */}

                    <aside className="space-y-6 self-start lg:sticky lg:top-24">

                        {/* Info berita */}
                        <Reveal>
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                <h3 className="font-bold text-indigo-950">
                                    Informasi berita
                                </h3>

                                <div className="mt-5 space-y-4">

                                    <div className="flex gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-700">
                                            <Tag className="h-5 w-5" />
                                        </span>

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Kategori
                                            </p>

                                            <p className="mt-0.5 font-semibold text-slate-800">
                                                {news.category}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700">
                                            <Calendar className="h-5 w-5" />
                                        </span>

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Dipublikasikan
                                            </p>

                                            <p className="mt-0.5 font-semibold text-slate-800">
                                                {formatDate(news.published_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                                            <Clock className="h-5 w-5" />
                                        </span>

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Waktu baca
                                            </p>

                                            <p className="mt-0.5 font-semibold text-slate-800">
                                                ± {getReadingTime(news.excerpt)} menit
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Reveal>

                        {/* CTA */}
                        <Reveal delay={120}>
                            <div className="rounded-3xl bg-gradient-to-b from-indigo-950 to-indigo-900 p-6 text-indigo-100">

                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                                    <Newspaper className="h-6 w-6 text-teal-300" />
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-white">
                                    Temukan berita lainnya
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-indigo-200">
                                    Lihat berbagai informasi terbaru,
                                    kegiatan, prestasi, dan kerja sama
                                    fakultas.
                                </p>

                                <Link
                                    href="/berita"
                                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                                >
                                    Semua berita
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                            </div>
                        </Reveal>

                    </aside>
                </div>
            </section>

            {/* ====================================================== */}
            {/* BERITA LAINNYA                                         */}
            {/* ====================================================== */}

            {related.length > 0 && (
                <section className="relative overflow-hidden bg-white py-16 lg:py-24">

                    <Blob className="-right-24 top-0 h-80 w-80 bg-gradient-to-br from-sky-200/60 to-indigo-200/40" />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <div className="flex flex-wrap items-end justify-between gap-4">

                            <Heading
                                title="Berita lainnya"
                                text="Baca informasi dan kabar terbaru lainnya."
                            />

                            <Reveal delay={120} className="mb-6">
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                                >
                                    Semua berita
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Reveal>

                        </div>

                        <div className="grid gap-6 md:grid-cols-3">

                            {related.map((item, index) => (
                                <Reveal
                                    key={item.id}
                                    delay={index * 110}
                                    className="h-full"
                                >
                                    <Link
                                        href={`/berita/${item.slug}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5"
                                    >

                                        <div className="relative aspect-[16/10] overflow-hidden">

                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />

                                            <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-2.5 py-1 text-sm font-semibold text-indigo-700 backdrop-blur">
                                                {item.category}
                                            </span>

                                        </div>

                                        <div className="flex flex-1 flex-col p-6">

                                            <p className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(item.published_at)}
                                            </p>

                                            <h3 className="mt-3 line-clamp-3 text-lg font-bold leading-snug text-indigo-950 transition group-hover:text-indigo-700">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-2 flex-1 leading-relaxed text-slate-600">
                                                {item.excerpt}
                                            </p>

                                            <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-700">
                                                Baca selengkapnya
                                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                            </span>

                                        </div>

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