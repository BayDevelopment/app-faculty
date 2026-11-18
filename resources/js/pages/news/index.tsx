// resources/js/pages/news/index.tsx
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    Eye,
    ImageIcon,
    ImageOff,
    Newspaper,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
    type RefObject,
} from "react";
import Swal from "sweetalert2";
import Blob from "@/components/blob";
import Reveal from "@/components/reveal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/*  KONFIGURASI                                                         */
/* ------------------------------------------------------------------ */

/** Sesuai Route::resource('kelola-berita', ...) di routes/web.php. */
const BASE_URL = "/kelola-berita";

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

type News = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string | null;
    /** URL siap pakai (accessor di model News). */
    image: string | null;
    published_at: string | null;
    is_published: boolean;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    news: {
        data: News[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
    options: { categories: string[] };
};

type NewsForm = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image: File | null;
    published_at: string;
    is_published: boolean;
};

const emptyForm: NewsForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    image: null,
    published_at: "",
    is_published: true,
};

/* ------------------------------------------------------------------ */
/*  STATUS                                                              */
/* ------------------------------------------------------------------ */

type Status = "Terbit" | "Terjadwal" | "Draf";

const today = () => {
    const d = new Date();

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Halaman publik hanya menampilkan berita yang terbit dan tanggalnya sudah tiba. */
const statusOf = (n: News): Status => {
    if (!n.is_published || !n.published_at) {
        return "Draf";
    }

    return n.published_at > today() ? "Terjadwal" : "Terbit";
};

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

/* ------------------------------------------------------------------ */
/*  STYLE & HELPER (sama dengan halaman program studi dan layanan)      */
/*  Saran: pindahkan ke file bersama, mis. resources/js/lib/ui.ts       */
/* ------------------------------------------------------------------ */

const card =
    "h-full rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-indigo-900/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none";
const titleCls = "text-lg font-bold text-indigo-950 dark:text-white";
const mutedCls = "text-sm text-slate-500 dark:text-slate-400";
const bodyCls = "text-slate-600 dark:text-slate-300";

const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500";
const fileCls = `${inputCls} file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-indigo-700 dark:file:bg-indigo-500/20 dark:file:text-indigo-300`;
const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60";
const btnGhost =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/10";

const esc = (v: string) =>
    v.replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c] as string,
    );

const trashIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

const swalDeleteClass = {
    container: "backdrop-blur-sm!",
    popup: "rounded-3xl! border! border-slate-200! bg-white! p-8! shadow-2xl! dark:border-white/10! dark:bg-indigo-950!",
    icon: "size-20! rounded-2xl! border-0! bg-rose-100! text-rose-600! dark:bg-rose-500/20! dark:text-rose-300!",
    title: "text-xl! font-bold! text-indigo-950! dark:text-white!",
    htmlContainer:
        "text-sm! leading-relaxed! text-slate-500! dark:text-slate-400!",
    actions: "w-full! gap-3!",
    confirmButton:
        "rounded-xl! bg-rose-600! px-5! py-2.5! text-sm! font-semibold! text-white! shadow-none! transition hover:bg-rose-700! focus:ring-4! focus:ring-rose-500/30!",
    cancelButton:
        "rounded-xl! border! border-slate-200! bg-white! px-5! py-2.5! text-sm! font-semibold! text-slate-700! shadow-none! transition hover:bg-slate-50! dark:border-white/10! dark:bg-white/[0.04]! dark:text-slate-200! dark:hover:bg-white/10!",
};

const swalToastClass = {
    popup: "rounded-2xl! border! border-slate-200! bg-white! text-indigo-950! shadow-xl! dark:border-white/10! dark:bg-indigo-950! dark:text-white!",
    title: "text-sm! font-semibold!",
};

const stagger = (i: number, cols = 3) => (i % cols) * 110;

/* ------------------------------------------------------------------ */
/*  KOMPONEN KECIL                                                      */
/* ------------------------------------------------------------------ */

type PillColor = "indigo" | "teal" | "amber" | "slate";

const pillMap: Record<PillColor, string> = {
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    slate: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
};

const statusColor: Record<Status, PillColor> = {
    Terbit: "teal",
    Terjadwal: "amber",
    Draf: "slate",
};

function Pill({
    children,
    color = "indigo",
}: {
    children: ReactNode;
    color?: PillColor;
}) {
    return (
        <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${pillMap[color]}`}
        >
            {children}
        </span>
    );
}

function Field({
    label,
    error,
    required,
    hint,
    className = "",
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={`grid gap-1.5 ${className}`}>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {label}
                {required && <span className="ml-0.5 text-rose-500">*</span>}
            </label>
            {children}
            {hint && !error && <p className={mutedCls}>{hint}</p>}
            {error && (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    {error}
                </p>
            )}
        </div>
    );
}

function SectionLabel({ children }: { children: ReactNode }) {
    return (
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {children}
        </p>
    );
}

/** Input file + preview. */
function ImageField({
    label,
    inputRef,
    preview,
    error,
    onPick,
}: {
    label: string;
    inputRef: RefObject<HTMLInputElement | null>;
    preview: string | null;
    error?: string;
    onPick: (file: File | null) => void;
}) {
    return (
        <Field label={label} error={error}>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={fileCls}
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <p className={mutedCls}>JPG, PNG, atau WEBP. Maks 2 MB.</p>
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="mt-1 h-40 w-full rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-indigo-500/10"
                />
            )}
        </Field>
    );
}

/** Thumbnail: ImageIcon = belum ada gambar, ImageOff = file gagal dimuat. */
function Thumb({ src, alt }: { src: string | null; alt: string }) {
    const [failed, setFailed] = useState(false);

    if (!src) {
        return (
            <span
                title="Belum ada gambar"
                className="grid h-14 w-20 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/10"
            >
                <ImageIcon className="h-5 w-5" />
            </span>
        );
    }

    if (failed) {
        return (
            <span
                title={`Gambar gagal dimuat: ${src}`}
                className="grid h-14 w-20 place-items-center rounded-xl bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
            >
                <ImageOff className="h-5 w-5" />
            </span>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            className="h-14 w-20 rounded-xl bg-indigo-100 object-cover ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:ring-indigo-500/10"
        />
    );
}

function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center gap-1.5">
            {links.map((link, i) => {
                const label = link.label
                    .replace("&laquo; Previous", "Sebelumnya")
                    .replace("Next &raquo;", "Berikutnya");
                const base =
                    "rounded-xl border px-3.5 py-2 text-sm font-semibold transition";

                if (!link.url) {
                    return (
                        <span
                            key={i}
                            className={`${base} cursor-not-allowed border-slate-200 text-slate-400 opacity-60 dark:border-white/10`}
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`${base} ${
                            link.active
                                ? "border-indigo-700 bg-indigo-700 text-white"
                                : "border-slate-200 text-slate-600 hover:bg-indigo-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

/* ------------------------------------------------------------------ */
/*  HALAMAN                                                             */
/* ------------------------------------------------------------------ */

export default function NewsIndex({ news, filters, options }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<News | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search ?? "");
    const imageRef = useRef<HTMLInputElement>(null);

    const form = useForm<NewsForm>(emptyForm);
    const errors = form.errors as Record<string, string>;

    /* ---------- Toast dari flash message ---------- */
    useEffect(() => {
        const message = flash?.success ?? flash?.error;

        if (!message) {
            return;
        }

        Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: swalToastClass,
        }).fire({
            icon: flash?.success ? "success" : "error",
            title: message,
        });
    }, [flash?.success, flash?.error]);

    /* ---------- Modal ---------- */
    const resetFile = () => {
        if (imageRef.current) {
            imageRef.current.value = "";
        }
    };

    const openCreate = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
        resetFile();
        setPreview(null);
        setOpen(true);
    };

    const openEdit = (n: News) => {
        setEditing(n);
        form.clearErrors();
        form.setData({
            title: n.title,
            slug: n.slug,
            excerpt: n.excerpt,
            content: n.content,
            category: n.category ?? "",
            image: null,
            published_at: n.published_at ?? "",
            is_published: n.is_published,
        });
        resetFile();
        setPreview(n.image);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        form.reset();
        form.clearErrors();
        resetFile();
        setPreview(null);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        const opts = {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                closeModal();

                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: editing
                        ? "Berita berhasil diperbarui."
                        : "Berita berhasil ditambahkan.",
                    confirmButtonText: "OK",
                    buttonsStyling: false,
                    customClass: {
                        popup: "rounded-3xl! border! border-slate-200! bg-white! p-8! shadow-2xl! dark:border-white/10! dark:bg-indigo-950!",
                        icon: "size-20!",
                        title: "text-xl! font-bold! text-indigo-950! dark:text-white!",
                        htmlContainer:
                            "text-sm! leading-relaxed! text-slate-500! dark:text-slate-400!",
                        confirmButton:
                            "rounded-xl! bg-indigo-700! px-5! py-2.5! text-sm! font-semibold! text-white! transition hover:bg-indigo-800!",
                    },
                });
            },
        };

        if (editing) {
            // File hanya bisa dikirim lewat POST, jadi PUT dipalsukan dengan _method.
            form.transform((data) => ({ ...data, _method: "put" }));
            form.post(`${BASE_URL}/${editing.id}`, opts);
        } else {
            form.transform((data) => data);
            form.post(BASE_URL, opts);
        }
    };

    /* ---------- Hapus ---------- */
    const confirmDelete = (n: News) => {
        Swal.fire({
            icon: "warning",
            iconHtml: trashIcon,
            title: "Hapus berita ini?",
            html: `Berita <b class="text-indigo-950 dark:text-white">${esc(n.title)}</b> akan dihapus permanen beserta gambarnya dan tidak dapat dikembalikan.`,
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            focusCancel: true,
            buttonsStyling: false,
            backdrop: "rgba(30, 27, 75, 0.55)",
            customClass: swalDeleteClass,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`${BASE_URL}/${n.id}`, { preserveScroll: true });
            }
        });
    };

    /* ---------- Pencarian ---------- */
    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            BASE_URL,
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    };

    const resetSearch = () => {
        setSearch("");
        router.get(BASE_URL, {}, { preserveState: true, replace: true });
    };

    /* ---------------------------------------------------------------- */
    return (
        <>
            <Head title="Data Berita" />

            <div className="relative flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-4 md:p-6">
                {/* dekorasi latar */}
                <Blob className="-left-24 top-40 h-80 w-80 bg-gradient-to-br from-indigo-300/40 to-sky-200/30 dark:from-indigo-500/15 dark:to-sky-400/5" />
                <Blob className="-right-24 top-[28rem] h-96 w-96 bg-gradient-to-br from-teal-200/50 to-emerald-100/30 dark:from-teal-400/10 dark:to-emerald-300/5" />

                {/* ============ BANNER ============ */}
                <Reveal className="relative">
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-500 p-7 text-white shadow-xl shadow-indigo-600/20 sm:p-8">
                        <Blob className="-right-16 -top-20 h-72 w-72 bg-white/15" />
                        <Blob className="-bottom-24 left-1/4 h-64 w-64 bg-amber-200/20" />

                        <div className="relative flex flex-wrap items-center justify-between gap-5">
                            <div className="max-w-2xl">
                                <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
                                    <span className="h-2 w-2 rounded-full bg-teal-300" />
                                    {news.total} berita tercatat
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Data Berita
                                </h1>
                                <p className="mt-2 text-base leading-relaxed text-indigo-100">
                                    Tulis, jadwalkan, dan kelola berita yang
                                    tampil di website fakultas.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Berita
                            </button>
                        </div>
                    </section>
                </Reveal>

                {/* ============ TABEL ============ */}
                <Reveal delay={stagger(1)} className="relative">
                    <section className={`${card} !p-0 overflow-hidden`}>
                        {/* toolbar */}
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-white/10"
                        >
                            <div>
                                <h2 className={titleCls}>Daftar berita</h2>
                                <p className={mutedCls}>
                                    {news.total > 0
                                        ? `Menampilkan ${news.from}–${news.to} dari ${news.total} data`
                                        : "Belum ada data"}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari judul, ringkasan, kategori..."
                                        className={`${inputCls} pl-10`}
                                    />
                                </div>
                                <button type="submit" className={btnPrimary}>
                                    Cari
                                </button>
                                {filters.search && (
                                    <button
                                        type="button"
                                        onClick={resetSearch}
                                        className={btnGhost}
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* tabel */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                                    <tr>
                                        <th className="w-14 px-5 py-3">No</th>
                                        <th className="w-28 px-5 py-3">
                                            Gambar
                                        </th>
                                        <th className="px-5 py-3">Berita</th>
                                        <th className="px-5 py-3">Tanggal</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="w-36 px-5 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                    {news.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-5 py-14"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                        <Newspaper className="h-7 w-7" />
                                                    </span>
                                                    <p className={mutedCls}>
                                                        {filters.search
                                                            ? "Data tidak ditemukan."
                                                            : "Belum ada berita."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {news.data.map((n, i) => {
                                        const status = statusOf(n);

                                        return (
                                            <tr
                                                key={n.id}
                                                className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                            >
                                                <td
                                                    className={`px-5 py-4 tabular-nums ${bodyCls}`}
                                                >
                                                    {(news.from ?? 1) + i}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Thumb
                                                        key={n.image}
                                                        src={n.image}
                                                        alt={n.title}
                                                    />
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="max-w-md font-semibold text-indigo-950 dark:text-white">
                                                            {n.title}
                                                        </p>
                                                        {n.category && (
                                                            <Pill>
                                                                {n.category}
                                                            </Pill>
                                                        )}
                                                    </div>
                                                    <p
                                                        className={`${mutedCls} line-clamp-2 max-w-md`}
                                                    >
                                                        {n.excerpt}
                                                    </p>
                                                    <p className={mutedCls}>
                                                        /{n.slug}
                                                    </p>
                                                </td>
                                                <td
                                                    className={`whitespace-nowrap px-5 py-4 ${bodyCls}`}
                                                >
                                                    {n.published_at
                                                        ? formatDate(
                                                              n.published_at,
                                                          )
                                                        : "—"}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <Pill
                                                        color={
                                                            statusColor[status]
                                                        }
                                                    >
                                                        {status}
                                                    </Pill>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        {status ===
                                                            "Terbit" && (
                                                            <a
                                                                href={`/berita/${n.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Lihat di website"
                                                                className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-100 text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                        <button
                                                            type="button"
                                                            title="Edit"
                                                            onClick={() =>
                                                                openEdit(n)
                                                            }
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 transition hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Hapus"
                                                            onClick={() =>
                                                                confirmDelete(n)
                                                            }
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-rose-700 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* pagination */}
                        {news.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                                <p className={mutedCls}>Halaman data berita</p>
                                <Pagination links={news.links} />
                            </div>
                        )}
                    </section>
                </Reveal>
            </div>

            {/* ============ MODAL CREATE / EDIT ============ */}
            <Dialog open={open} onOpenChange={(v) => !v && closeModal()}>
                <DialogContent
                    className="max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 bg-white p-6 sm:max-w-3xl sm:p-8 dark:border-white/10 dark:bg-indigo-950"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className={titleCls}>
                            {editing ? "Edit Berita" : "Tambah Berita"}
                        </DialogTitle>
                        <DialogDescription className={mutedCls}>
                            {editing
                                ? "Perbarui berita lalu simpan perubahan."
                                : "Lengkapi data berita baru di bawah ini."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="mt-2 grid gap-5">
                        {/* ---- Isi berita ---- */}
                        <SectionLabel>Isi berita</SectionLabel>

                        <Field label="Judul" required error={errors.title}>
                            <input
                                className={inputCls}
                                value={form.data.title}
                                maxLength={255}
                                placeholder="Contoh: Mahasiswa Teknik Kimia mengikuti kunjungan industri"
                                onChange={(e) =>
                                    form.setData("title", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Slug"
                            error={errors.slug}
                            hint={
                                editing
                                    ? "Ubah hanya jika perlu, karena akan mengubah URL berita."
                                    : "Kosongkan untuk dibuat otomatis dari judul."
                            }
                        >
                            <input
                                className={inputCls}
                                value={form.data.slug}
                                maxLength={255}
                                placeholder="kunjungan-industri-teknik-kimia"
                                onChange={(e) =>
                                    form.setData("slug", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Ringkasan"
                            required
                            error={errors.excerpt}
                            hint={`${form.data.excerpt.length}/255 karakter. Tampil di kartu daftar berita.`}
                        >
                            <textarea
                                rows={3}
                                maxLength={255}
                                className={inputCls}
                                value={form.data.excerpt}
                                placeholder="Ringkasan satu-dua kalimat tentang berita ini..."
                                onChange={(e) =>
                                    form.setData("excerpt", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Isi lengkap"
                            required
                            error={errors.content}
                            hint="Tampil di halaman detail berita."
                        >
                            <textarea
                                rows={10}
                                className={inputCls}
                                value={form.data.content}
                                placeholder="Tulis isi berita di sini..."
                                onChange={(e) =>
                                    form.setData("content", e.target.value)
                                }
                            />
                        </Field>

                        {/* ---- Media & kategori ---- */}
                        <SectionLabel>Media &amp; kategori</SectionLabel>

                        <ImageField
                            label="Gambar utama"
                            inputRef={imageRef}
                            preview={preview}
                            error={errors.image}
                            onPick={(file) => {
                                form.setData("image", file);

                                if (file) {
                                    setPreview(URL.createObjectURL(file));
                                } else {
                                    setPreview(editing?.image ?? null);
                                }
                            }}
                        />

                        <Field
                            label="Kategori"
                            error={errors.category}
                            hint="Ketik kategori baru atau pilih yang sudah ada."
                        >
                            <input
                                className={inputCls}
                                list="news-categories"
                                value={form.data.category}
                                maxLength={100}
                                placeholder="Contoh: Kegiatan"
                                onChange={(e) =>
                                    form.setData("category", e.target.value)
                                }
                            />
                            <datalist id="news-categories">
                                {options.categories.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </Field>

                        {/* ---- Penerbitan ---- */}
                        <SectionLabel>Penerbitan</SectionLabel>

                        <Field
                            label="Tanggal terbit"
                            error={errors.published_at}
                            hint="Kosongkan untuk memakai tanggal hari ini. Tanggal di masa depan menjadwalkan berita."
                        >
                            <input
                                type="date"
                                className={inputCls}
                                value={form.data.published_at}
                                onChange={(e) =>
                                    form.setData("published_at", e.target.value)
                                }
                            />
                        </Field>

                        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                            <input
                                type="checkbox"
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-700"
                                checked={form.data.is_published}
                                onChange={(e) =>
                                    form.setData(
                                        "is_published",
                                        e.target.checked,
                                    )
                                }
                            />
                            <span>
                                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Terbitkan di website
                                </span>
                                <span className={mutedCls}>
                                    Hilangkan centang untuk menyimpan sebagai
                                    draf. Draf tidak muncul di halaman publik.
                                </span>
                            </span>
                        </label>
                        {errors.is_published && (
                            <p className="-mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                                {errors.is_published}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={form.processing}
                                className={btnGhost}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className={btnPrimary}
                            >
                                {form.processing
                                    ? "Menyimpan..."
                                    : editing
                                      ? "Simpan perubahan"
                                      : "Simpan"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

NewsIndex.layout = {
    breadcrumbs: [
        {
            title: "Berita",
            href: BASE_URL,
        },
    ],
};
