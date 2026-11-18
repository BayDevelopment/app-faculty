// resources/js/pages/testimonial/index.tsx
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    ImageOff,
    MessageSquareQuote,
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

/** Sesuai Route::resource('testimonial', ...) di routes/web.php. */
const BASE_URL = "/testimonial";

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

type Testimonial = {
    id: number;
    name: string;
    batch: string;
    job: string;
    company: string;
    quote: string;
    /** URL siap pakai (accessor di model Testimonial). */
    photo: string | null;
    sort_order: number;
    is_active: boolean;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    testimonials: {
        data: Testimonial[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
};

type TestimonialForm = {
    name: string;
    batch: string;
    job: string;
    company: string;
    quote: string;
    photo: File | null;
    sort_order: string;
    is_active: boolean;
};

const emptyForm: TestimonialForm = {
    name: "",
    batch: "",
    job: "",
    company: "",
    quote: "",
    photo: null,
    sort_order: "0",
    is_active: true,
};

/* ------------------------------------------------------------------ */
/*  STYLE & HELPER (sama dengan halaman admin lainnya)                  */
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

/** Input file + preview bulat (foto alumni). */
function PhotoField({
    inputRef,
    preview,
    error,
    onPick,
}: {
    inputRef: RefObject<HTMLInputElement | null>;
    preview: string | null;
    error?: string;
    onPick: (file: File | null) => void;
}) {
    return (
        <Field label="Foto alumni" error={error}>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={fileCls}
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <p className={mutedCls}>
                JPG, PNG, atau WEBP. Maks 2 MB. Foto persegi paling pas.
            </p>
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="mt-1 h-28 w-28 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-500/10"
                />
            )}
        </Field>
    );
}

/** Foto bulat; tanpa foto tampil inisial, foto gagal dimuat tampil ImageOff. */
function Avatar({ src, name }: { src: string | null; name: string }) {
    const [failed, setFailed] = useState(false);

    if (src && failed) {
        return (
            <span
                title={`Foto gagal dimuat: ${src}`}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
            >
                <ImageOff className="h-5 w-5" />
            </span>
        );
    }

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                onError={() => setFailed(true)}
                className="h-12 w-12 shrink-0 rounded-full bg-indigo-100 object-cover ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:ring-indigo-500/10"
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
            title="Belum ada foto"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-500/10"
        >
            {initials || "?"}
        </span>
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

export default function TestimonialIndex({ testimonials, filters }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search ?? "");
    const photoRef = useRef<HTMLInputElement>(null);

    const form = useForm<TestimonialForm>(emptyForm);
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
        if (photoRef.current) {
            photoRef.current.value = "";
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

    const openEdit = (t: Testimonial) => {
        setEditing(t);
        form.clearErrors();
        form.setData({
            name: t.name,
            batch: t.batch,
            job: t.job,
            company: t.company,
            quote: t.quote,
            photo: null,
            sort_order: String(t.sort_order),
            is_active: t.is_active,
        });
        resetFile();
        setPreview(t.photo);
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
                        ? "Testimonial berhasil diperbarui."
                        : "Testimonial berhasil ditambahkan.",
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
    const confirmDelete = (t: Testimonial) => {
        Swal.fire({
            icon: "warning",
            iconHtml: trashIcon,
            title: "Hapus testimonial ini?",
            html: `Testimonial dari <b class="text-indigo-950 dark:text-white">${esc(t.name)}</b> akan dihapus permanen beserta fotonya dan tidak dapat dikembalikan.`,
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
                router.delete(`${BASE_URL}/${t.id}`, { preserveScroll: true });
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
            <Head title="Data Testimonial" />

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
                                    {testimonials.total} testimonial terdaftar
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Data Testimonial
                                </h1>
                                <p className="mt-2 text-base leading-relaxed text-indigo-100">
                                    Kelola kutipan alumni yang tampil di bagian
                                    “Kata alumni” pada website.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Testimonial
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
                                <h2 className={titleCls}>Daftar testimonial</h2>
                                <p className={mutedCls}>
                                    {testimonials.total > 0
                                        ? `Menampilkan ${testimonials.from}–${testimonials.to} dari ${testimonials.total} data`
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
                                        placeholder="Cari nama, angkatan, pekerjaan..."
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
                                        <th className="px-5 py-3">Alumni</th>
                                        <th className="px-5 py-3">Kutipan</th>
                                        <th className="px-5 py-3 text-center">
                                            Urutan
                                        </th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="w-28 px-5 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                    {testimonials.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-5 py-14"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                        <MessageSquareQuote className="h-7 w-7" />
                                                    </span>
                                                    <p className={mutedCls}>
                                                        {filters.search
                                                            ? "Data tidak ditemukan."
                                                            : "Belum ada testimonial."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {testimonials.data.map((t, i) => (
                                        <tr
                                            key={t.id}
                                            className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                        >
                                            <td
                                                className={`px-5 py-4 tabular-nums ${bodyCls}`}
                                            >
                                                {(testimonials.from ?? 1) + i}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        key={t.photo}
                                                        src={t.photo}
                                                        name={t.name}
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="font-semibold text-indigo-950 dark:text-white">
                                                                {t.name}
                                                            </p>
                                                            <Pill>
                                                                {t.batch}
                                                            </Pill>
                                                        </div>
                                                        <p
                                                            className={`${mutedCls} line-clamp-1`}
                                                        >
                                                            {t.job}, {t.company}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p
                                                    className={`${mutedCls} line-clamp-2 max-w-sm`}
                                                >
                                                    {t.quote}
                                                </p>
                                            </td>
                                            <td
                                                className={`px-5 py-4 text-center tabular-nums ${bodyCls}`}
                                            >
                                                {t.sort_order}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Pill
                                                    color={
                                                        t.is_active
                                                            ? "teal"
                                                            : "slate"
                                                    }
                                                >
                                                    {t.is_active
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </Pill>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEdit(t)
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 transition hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Hapus"
                                                        onClick={() =>
                                                            confirmDelete(t)
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-rose-700 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* pagination */}
                        {testimonials.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                                <p className={mutedCls}>
                                    Halaman data testimonial
                                </p>
                                <Pagination links={testimonials.links} />
                            </div>
                        )}
                    </section>
                </Reveal>
            </div>

            {/* ============ MODAL CREATE / EDIT ============ */}
            <Dialog open={open} onOpenChange={(v) => !v && closeModal()}>
                <DialogContent
                    className="max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 bg-white p-6 sm:max-w-2xl sm:p-8 dark:border-white/10 dark:bg-indigo-950"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className={titleCls}>
                            {editing
                                ? "Edit Testimonial"
                                : "Tambah Testimonial"}
                        </DialogTitle>
                        <DialogDescription className={mutedCls}>
                            {editing
                                ? "Perbarui data testimonial lalu simpan perubahan."
                                : "Lengkapi data testimonial alumni di bawah ini."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="mt-2 grid gap-5">
                        {/* ---- Alumni ---- */}
                        <SectionLabel>Alumni</SectionLabel>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Nama" required error={errors.name}>
                                <input
                                    className={inputCls}
                                    value={form.data.name}
                                    maxLength={255}
                                    placeholder="Contoh: Rina Maharani"
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Angkatan"
                                required
                                error={errors.batch}
                                hint="Maks 30 karakter."
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.batch}
                                    maxLength={30}
                                    placeholder="Contoh: Angkatan 2017"
                                    onChange={(e) =>
                                        form.setData("batch", e.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Pekerjaan"
                                required
                                error={errors.job}
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.job}
                                    maxLength={255}
                                    placeholder="Contoh: Staf Perencanaan Produksi"
                                    onChange={(e) =>
                                        form.setData("job", e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Perusahaan"
                                required
                                error={errors.company}
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.company}
                                    maxLength={255}
                                    placeholder="Contoh: PT Contoh Manufaktur"
                                    onChange={(e) =>
                                        form.setData("company", e.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <PhotoField
                            inputRef={photoRef}
                            preview={preview}
                            error={errors.photo}
                            onPick={(file) => {
                                form.setData("photo", file);

                                if (file) {
                                    setPreview(URL.createObjectURL(file));
                                } else {
                                    setPreview(editing?.photo ?? null);
                                }
                            }}
                        />

                        {/* ---- Kutipan ---- */}
                        <SectionLabel>Kutipan</SectionLabel>

                        <Field
                            label="Testimoni"
                            required
                            error={errors.quote}
                            hint={`${form.data.quote.length}/1000 karakter. Tampil sebagai kutipan besar di website.`}
                        >
                            <textarea
                                rows={5}
                                maxLength={1000}
                                className={inputCls}
                                value={form.data.quote}
                                placeholder="Tulis pengalaman alumni selama berkuliah dan bekerja..."
                                onChange={(e) =>
                                    form.setData("quote", e.target.value)
                                }
                            />
                        </Field>

                        {/* ---- Tampilan ---- */}
                        <SectionLabel>Tampilan</SectionLabel>

                        <Field
                            label="Urutan Tampil"
                            required
                            error={errors.sort_order}
                            hint="Angka kecil tampil lebih dulu."
                        >
                            <input
                                type="number"
                                min={0}
                                max={65535}
                                className={inputCls}
                                value={form.data.sort_order}
                                onChange={(e) =>
                                    form.setData("sort_order", e.target.value)
                                }
                            />
                        </Field>

                        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                            <input
                                type="checkbox"
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-700"
                                checked={form.data.is_active}
                                onChange={(e) =>
                                    form.setData("is_active", e.target.checked)
                                }
                            />
                            <span>
                                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Tampilkan di website
                                </span>
                                <span className={mutedCls}>
                                    Testimonial nonaktif tidak muncul di halaman
                                    publik.
                                </span>
                            </span>
                        </label>
                        {errors.is_active && (
                            <p className="-mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                                {errors.is_active}
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

TestimonialIndex.layout = {
    breadcrumbs: [
        {
            title: "Testimonial",
            href: BASE_URL,
        },
    ],
};
