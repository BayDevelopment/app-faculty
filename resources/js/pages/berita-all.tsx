import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Newspaper,
    Search,
    Tag,
} from "lucide-react";
import { FormEvent, useState } from "react";

import Blob from "@/components/blob";
import CategoryTabs from "@/components/category-tabs";
import Reveal from "@/components/reveal";
import PublicLayout from "@/layouts/public-layout";

/* ------------------------------------------------------------------ */
/* TYPES                                                              */
/* ------------------------------------------------------------------ */

type News = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    image: string | null;
    published_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type NewsPagination = {
    data: News[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

type Props = {
    news: NewsPagination;
    categories: string[];
    filters: {
        search: string;
        category: string;
    };
};

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

/* ------------------------------------------------------------------ */
/* PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function BeritaAll({ news, categories = [], filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    const currentCategory = filters.category || "Semua";

    /* -------------------------------------------------------------- */
    /* SEARCH                                                         */
    /* -------------------------------------------------------------- */

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            "/berita",
            {
                search: search || undefined,
                category:
                    currentCategory !== "Semua" ? currentCategory : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    /* -------------------------------------------------------------- */
    /* CATEGORY                                                       */
    /* -------------------------------------------------------------- */

    const handleCategory = (category: string) => {
        router.get(
            "/berita",
            {
                search: search || undefined,
                category: category !== "Semua" ? category : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    /* -------------------------------------------------------------- */
    /* RESET                                                          */
    /* -------------------------------------------------------------- */

    const handleReset = () => {
        setSearch("");

        router.get(
            "/berita",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <PublicLayout>
            <Head title="Berita" />

            {/* ====================================================== */}
            {/* HERO                                                   */}
            {/* ====================================================== */}

            <section className="relative overflow-hidden">
                <Blob className="-left-32 -top-24 h-[26rem] w-[26rem] bg-gradient-to-br from-indigo-400/50 to-sky-300/40" />

                <Blob className="right-[-8rem] top-10 h-[28rem] w-[28rem] bg-gradient-to-br from-teal-300/50 to-emerald-200/40" />

                <Blob className="bottom-[-6rem] left-1/3 h-64 w-64 bg-gradient-to-br from-amber-200/60 to-orange-200/30" />

                <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-32">
                    {/* Breadcrumb */}
                    <Reveal>
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-2 text-sm text-slate-500"
                        >
                            <Link
                                href="/#beranda"
                                className="transition hover:text-indigo-700"
                            >
                                Beranda
                            </Link>

                            <span>/</span>

                            <span className="font-medium text-indigo-900">
                                Berita
                            </span>
                        </nav>
                    </Reveal>

                    {/* Heading */}
                    <Reveal delay={100}>
                        <div className="mt-8 max-w-4xl">
                            <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                                <Newspaper className="h-4 w-4" />
                                Informasi Fakultas
                            </span>

                            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-indigo-950 sm:text-5xl lg:text-6xl">
                                Berita & Informasi
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                                Temukan berbagai informasi terbaru seputar
                                kegiatan, prestasi, kerja sama, akademik, dan
                                perkembangan Fakultas Teknik dan Sains.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ====================================================== */}
            {/* FILTER & SEARCH                                        */}
            {/* ====================================================== */}

            <section className="relative z-10 -mt-4 pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal delay={180}>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-900/5 sm:p-6">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                                {/* Search */}
                                <form
                                    onSubmit={handleSearch}
                                    className="relative w-full shrink-0 lg:w-80"
                                >
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Cari berita..."
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                    />
                                </form>

                                {/* Categories */}
                                <CategoryTabs
                                    items={categories}
                                    active={currentCategory}
                                    onSelect={handleCategory}
                                />
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ====================================================== */}
            {/* DAFTAR BERITA                                          */}
            {/* ====================================================== */}

            <section className="relative overflow-hidden pb-20 lg:pb-28">
                <Blob className="-right-32 top-20 h-96 w-96 bg-gradient-to-br from-sky-200/40 to-indigo-200/30" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <Reveal>
                        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-indigo-600">
                                    Koleksi berita
                                </p>

                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-indigo-950 sm:text-3xl">
                                    Semua Berita
                                </h2>
                            </div>

                            <p className="text-sm text-slate-500">
                                {news.total > 0
                                    ? `Menampilkan ${news.from}–${news.to} dari ${news.total} berita`
                                    : "Tidak ada berita"}
                            </p>
                        </div>
                    </Reveal>

                    {/* ================================================== */}
                    {/* CARDS                                                */}
                    {/* ================================================== */}

                    {news.data.length > 0 ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {news.data.map((item, index) => (
                                    <Reveal
                                        key={item.id}
                                        delay={index * 80}
                                        className="h-full"
                                    >
                                        <Link
                                            href={`/berita/${item.slug}`}
                                            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/10"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-100 via-sky-100 to-teal-100">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Newspaper className="h-16 w-16 text-indigo-300" />
                                                    </div>
                                                )}

                                                {/* Category */}
                                                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
                                                    <Tag className="h-3.5 w-3.5" />
                                                    {item.category}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-1 flex-col p-6">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Calendar className="h-4 w-4 text-indigo-500" />

                                                    <span>
                                                        {formatDate(
                                                            item.published_at,
                                                        )}
                                                    </span>
                                                </div>

                                                <h3 className="mt-4 line-clamp-3 text-xl font-bold leading-snug text-indigo-950 transition group-hover:text-indigo-700">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-slate-600">
                                                    {item.excerpt}
                                                </p>

                                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                                    <span className="text-sm font-semibold text-indigo-700">
                                                        Baca selengkapnya
                                                    </span>

                                                    <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-700 group-hover:text-white">
                                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </Reveal>
                                ))}
                            </div>

                            {/* ================================================== */}
                            {/* PAGINATION                                           */}
                            {/* ================================================== */}

                            {news.last_page > 1 && (
                                <Reveal delay={150}>
                                    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                                        {news.links.map((link, index) => {
                                            const isPrevious = index === 0;
                                            const isNext =
                                                index === news.links.length - 1;

                                            return (
                                                <Link
                                                    key={`${link.label}-${index}`}
                                                    href={link.url || "#"}
                                                    preserveScroll
                                                    className={`inline-flex min-h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${
                                                        !link.url
                                                            ? "pointer-events-none border-slate-100 bg-slate-50 text-slate-300"
                                                            : link.active
                                                              ? "border-indigo-700 bg-indigo-700 text-white shadow-md shadow-indigo-700/20"
                                                              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                                    }`}
                                                >
                                                    {isPrevious ? (
                                                        <>
                                                            <ArrowLeft className="mr-1 h-4 w-4" />
                                                            <span className="hidden sm:inline">
                                                                Sebelumnya
                                                            </span>
                                                        </>
                                                    ) : isNext ? (
                                                        <>
                                                            <span className="hidden sm:inline">
                                                                Berikutnya
                                                            </span>
                                                            <ArrowRight className="ml-1 h-4 w-4" />
                                                        </>
                                                    ) : (
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </Reveal>
                            )}

                            {/* Info pagination */}
                            {news.last_page > 1 && (
                                <div className="mt-5 text-center text-sm text-slate-500">
                                    Halaman{" "}
                                    <span className="font-semibold text-indigo-700">
                                        {news.current_page}
                                    </span>{" "}
                                    dari{" "}
                                    <span className="font-semibold text-indigo-700">
                                        {news.last_page}
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        /* ================================================== */
                        /* EMPTY STATE                                          */
                        /* ================================================== */

                        <Reveal>
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                                    <Search className="h-7 w-7" />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-indigo-950">
                                    Berita tidak ditemukan
                                </h3>

                                <p className="mx-auto mt-2 max-w-md leading-relaxed text-slate-500">
                                    Tidak ada berita yang sesuai dengan kata
                                    kunci atau kategori yang dipilih.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-6 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
                                >
                                    Reset pencarian
                                </button>
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
