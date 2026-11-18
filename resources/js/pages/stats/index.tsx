// resources/js/pages/stats/index.tsx
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    BarChart3,
    ImageIcon,
    ImageOff,
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

/** Sesuai Route::resource('statistik', ...) di routes/web.php. */
const BASE_URL = "/statistik";

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

type Stat = {
    id: number;
    label: string;
    value: number;
    suffix: string | null;
    /** URL siap pakai (accessor di model Stat). */
    image: string | null;
    sort_order: number;
    is_active: boolean;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    stats: {
        data: Stat[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
};

type StatForm = {
    label: string;
    value: string;
    suffix: string;
    image: File | null;
    sort_order: string;
    is_active: boolean;
};

const emptyForm: StatForm = {
    label: "",
    value: "0",
    suffix: "",
    image: null,
    sort_order: "0",
    is_active: true,
};

/** Format angka seperti di halaman publik: 3450 menjadi 3.450. */
const formatNumber = (n: number) => n.toLocaleString("id-ID");

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

/** Input file + preview kotak. */
function ImageField({
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
        <Field label="Gambar / ikon" error={error}>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={fileCls}
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <p className={mutedCls}>
                JPG, PNG, atau WEBP. Maks 2 MB. Gambar persegi paling pas.
            </p>
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="mt-1 h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-indigo-500/10"
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
                className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/10"
            >
                <ImageIcon className="h-5 w-5" />
            </span>
        );
    }

    if (failed) {
        return (
            <span
                title={`Gambar gagal dimuat: ${src}`}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
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
            className="h-12 w-12 rounded-2xl bg-indigo-100 object-cover ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:ring-indigo-500/10"
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

export default function StatIndex({ stats, filters }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Stat | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search ?? "");
    const imageRef = useRef<HTMLInputElement>(null);

    const form = useForm<StatForm>(emptyForm);
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

    const openEdit = (s: Stat) => {
        setEditing(s);
        form.clearErrors();
        form.setData({
            label: s.label,
            value: String(s.value),
            suffix: s.suffix ?? "",
            image: null,
            sort_order: String(s.sort_order),
            is_active: s.is_active,
        });
        resetFile();
        setPreview(s.image);
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
                        ? "Statistik berhasil diperbarui."
                        : "Statistik berhasil ditambahkan.",
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
    const confirmDelete = (s: Stat) => {
        Swal.fire({
            icon: "warning",
            iconHtml: trashIcon,
            title: "Hapus statistik ini?",
            html: `Data <b class="text-indigo-950 dark:text-white">${esc(s.label)}</b> akan dihapus permanen beserta gambarnya dan tidak dapat dikembalikan.`,
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
                router.delete(`${BASE_URL}/${s.id}`, { preserveScroll: true });
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
            <Head title="Data Statistik" />

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
                                    {stats.total} statistik terdaftar
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Data Statistik
                                </h1>
                                <p className="mt-2 text-base leading-relaxed text-indigo-100">
                                    Kelola angka-angka fakultas yang tampil di
                                    bagian atas halaman beranda.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Statistik
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
                                <h2 className={titleCls}>Daftar statistik</h2>
                                <p className={mutedCls}>
                                    {stats.total > 0
                                        ? `Menampilkan ${stats.from}–${stats.to} dari ${stats.total} data`
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
                                        placeholder="Cari label statistik..."
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
                                        <th className="w-24 px-5 py-3">
                                            Gambar
                                        </th>
                                        <th className="px-5 py-3">Label</th>
                                        <th className="px-5 py-3 text-right">
                                            Nilai
                                        </th>
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
                                    {stats.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-5 py-14"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                        <BarChart3 className="h-7 w-7" />
                                                    </span>
                                                    <p className={mutedCls}>
                                                        {filters.search
                                                            ? "Data tidak ditemukan."
                                                            : "Belum ada statistik."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {stats.data.map((s, i) => (
                                        <tr
                                            key={s.id}
                                            className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                        >
                                            <td
                                                className={`px-5 py-4 tabular-nums ${bodyCls}`}
                                            >
                                                {(stats.from ?? 1) + i}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Thumb
                                                    key={s.image}
                                                    src={s.image}
                                                    alt={s.label}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-indigo-950 dark:text-white">
                                                    {s.label}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-right text-base font-bold tabular-nums text-indigo-950 dark:text-white">
                                                {formatNumber(s.value)}
                                                {s.suffix}
                                            </td>
                                            <td
                                                className={`px-5 py-4 text-center tabular-nums ${bodyCls}`}
                                            >
                                                {s.sort_order}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Pill
                                                    color={
                                                        s.is_active
                                                            ? "teal"
                                                            : "slate"
                                                    }
                                                >
                                                    {s.is_active
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
                                                            openEdit(s)
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 transition hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Hapus"
                                                        onClick={() =>
                                                            confirmDelete(s)
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
                        {stats.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                                <p className={mutedCls}>
                                    Halaman data statistik
                                </p>
                                <Pagination links={stats.links} />
                            </div>
                        )}
                    </section>
                </Reveal>
            </div>

            {/* ============ MODAL CREATE / EDIT ============ */}
            <Dialog open={open} onOpenChange={(v) => !v && closeModal()}>
                <DialogContent
                    className="max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 bg-white p-6 sm:max-w-xl sm:p-8 dark:border-white/10 dark:bg-indigo-950"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className={titleCls}>
                            {editing ? "Edit Statistik" : "Tambah Statistik"}
                        </DialogTitle>
                        <DialogDescription className={mutedCls}>
                            {editing
                                ? "Perbarui data statistik lalu simpan perubahan."
                                : "Lengkapi data statistik baru di bawah ini."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="mt-2 grid gap-5">
                        <Field
                            label="Label"
                            required
                            error={errors.label}
                            hint="Keterangan yang tampil di bawah angka."
                        >
                            <input
                                className={inputCls}
                                value={form.data.label}
                                maxLength={255}
                                placeholder="Contoh: Mahasiswa aktif"
                                onChange={(e) =>
                                    form.setData("label", e.target.value)
                                }
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Nilai" required error={errors.value}>
                                <input
                                    type="number"
                                    min={0}
                                    className={inputCls}
                                    value={form.data.value}
                                    placeholder="Contoh: 3450"
                                    onChange={(e) =>
                                        form.setData("value", e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Akhiran"
                                error={errors.suffix}
                                hint="Opsional. Contoh: + atau %"
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.suffix}
                                    maxLength={10}
                                    placeholder="Contoh: +"
                                    onChange={(e) =>
                                        form.setData("suffix", e.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <ImageField
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

                        {/* pratinjau kartu */}
                        <div className="grid gap-1.5">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Pratinjau
                            </span>
                            <div className="flex items-start gap-4 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-white/15">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt=""
                                        className="h-12 w-12 shrink-0 rounded-2xl bg-indigo-100 object-cover"
                                    />
                                ) : (
                                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                        <BarChart3 className="h-6 w-6" />
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="text-3xl font-extrabold text-indigo-950 dark:text-white">
                                        {formatNumber(
                                            Number(form.data.value) || 0,
                                        )}
                                        {form.data.suffix}
                                    </p>
                                    <p className={`${mutedCls} break-words`}>
                                        {form.data.label || "Label statistik"}
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                    Statistik nonaktif tidak muncul di halaman
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

StatIndex.layout = {
    breadcrumbs: [
        {
            title: "Statistik",
            href: BASE_URL,
        },
    ],
};
