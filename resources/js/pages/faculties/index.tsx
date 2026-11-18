// resources/js/pages/faculties/index.tsx
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    GraduationCap,
    ImageIcon,
    ImageOff,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
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
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

type Faculty = {
    id: number;
    name: string;
    university: string;
    tagline: string;
    description: string;
    hero_image: string | null;
    vision: string;
    missions: string[];
    address: string;
    email: string;
    phone: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    faculties: {
        data: Faculty[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
};

type FacultyForm = {
    name: string;
    university: string;
    tagline: string;
    description: string;
    hero_image: File | null;
    vision: string;
    missions: string[];
    address: string;
    email: string;
    phone: string;
};

const emptyForm: FacultyForm = {
    name: "",
    university: "",
    tagline: "",
    description: "",
    hero_image: null,
    vision: "",
    missions: [""],
    address: "",
    email: "",
    phone: "",
};

/* ------------------------------------------------------------------ */
/*  STYLE & HELPER (sama dengan dashboard)                              */
/* ------------------------------------------------------------------ */

const card =
    "h-full rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-indigo-900/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none";
const titleCls = "text-lg font-bold text-indigo-950 dark:text-white";
const mutedCls = "text-sm text-slate-500 dark:text-slate-400";
const bodyCls = "text-slate-600 dark:text-slate-300";

const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500";
const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60";
const btnGhost =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/10";

/* ---------- SweetAlert2: styling kustom (Tailwind v4, tanda ! di belakang = important,
   perlu agar menang dari CSS bawaan SweetAlert. Di Tailwind v3 tulis ! di depan). ---------- */
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

function Field({
    label,
    error,
    required,
    className = "",
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
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

/** Thumbnail: ImageIcon = belum ada gambar di DB, ImageOff = path ada tapi file tidak bisa dimuat. */
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

export default function FacultyIndex({ faculties, filters }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Faculty | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search ?? "");
    const fileRef = useRef<HTMLInputElement>(null);

    const form = useForm<FacultyForm>(emptyForm);
    const errors = form.errors as Record<string, string>;
    const missionErrors = Array.from(
        new Set(
            Object.entries(errors)
                .filter(([k]) => k === "missions" || k.startsWith("missions."))
                .map(([, v]) => v),
        ),
    );

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
        if (fileRef.current) {
            fileRef.current.value = "";
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

    const openEdit = (f: Faculty) => {
        setEditing(f);
        form.clearErrors();
        form.setData({
            name: f.name,
            university: f.university,
            tagline: f.tagline,
            description: f.description,
            hero_image: null,
            vision: f.vision,
            missions: f.missions?.length ? f.missions : [""],
            address: f.address,
            email: f.email,
            phone: f.phone,
        });
        resetFile();
        setPreview(f.hero_image ? `/storage/${f.hero_image}` : null);
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

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => closeModal(),
        };

        if (editing) {
            // PHP tidak membaca multipart lewat PUT -> POST + _method spoofing
            form.transform((data) => ({ ...data, _method: "put" }));
            form.post(`/fakultas/${editing.id}`, options);
        } else {
            form.transform((data) => data);
            form.post("/fakultas", options);
        }
    };

    /* ---------- Misi dinamis ---------- */
    const setMission = (index: number, value: string) =>
        form.setData(
            "missions",
            form.data.missions.map((m, i) => (i === index ? value : m)),
        );

    const addMission = () =>
        form.setData("missions", [...form.data.missions, ""]);

    const removeMission = (index: number) =>
        form.setData(
            "missions",
            form.data.missions.length > 1
                ? form.data.missions.filter((_, i) => i !== index)
                : [""],
        );

    /* ---------- Hapus ---------- */
    const confirmDelete = (f: Faculty) => {
        Swal.fire({
            icon: "warning",
            iconHtml: trashIcon,
            title: "Hapus fakultas ini?",
            html: `Data <b class="text-indigo-950 dark:text-white">${esc(f.name)}</b> akan dihapus permanen beserta gambarnya dan tidak dapat dikembalikan.`,
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
                router.delete(`/fakultas/${f.id}`, { preserveScroll: true });
            }
        });
    };

    /* ---------- Pencarian ---------- */
    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/fakultas",
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    };

    const resetSearch = () => {
        setSearch("");
        router.get("/fakultas", {}, { preserveState: true, replace: true });
    };

    /* ---------------------------------------------------------------- */
    return (
        <>
            <Head title="Data Fakultas" />

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
                                    {faculties.total} fakultas terdaftar
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Data Fakultas
                                </h1>
                                <p className="mt-2 text-base leading-relaxed text-indigo-100">
                                    Kelola profil, visi, misi, dan kontak
                                    fakultas yang tampil di website.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Fakultas
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
                                <h2 className={titleCls}>Daftar fakultas</h2>
                                <p className={mutedCls}>
                                    {faculties.total > 0
                                        ? `Menampilkan ${faculties.from}–${faculties.to} dari ${faculties.total} data`
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
                                        placeholder="Cari nama, universitas, email..."
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
                                        <th className="px-5 py-3">Fakultas</th>
                                        <th className="px-5 py-3">Kontak</th>
                                        <th className="w-28 px-5 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                    {faculties.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-5 py-14"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                        <GraduationCap className="h-7 w-7" />
                                                    </span>
                                                    <p className={mutedCls}>
                                                        {filters.search
                                                            ? "Data tidak ditemukan."
                                                            : "Belum ada data fakultas."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {faculties.data.map((f, i) => (
                                        <tr
                                            key={f.id}
                                            className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                        >
                                            <td
                                                className={`px-5 py-4 tabular-nums ${bodyCls}`}
                                            >
                                                {(faculties.from ?? 1) + i}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Thumb
                                                    key={f.hero_image}
                                                    src={
                                                        f.hero_image
                                                            ? `/storage/${f.hero_image}`
                                                            : null
                                                    }
                                                    alt={f.name}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-indigo-950 dark:text-white">
                                                    {f.name}
                                                </p>
                                                <p className={mutedCls}>
                                                    {f.university}
                                                </p>
                                                <p
                                                    className={`${mutedCls} line-clamp-1 italic`}
                                                >
                                                    {f.tagline}
                                                </p>
                                                <div className="mt-1.5">
                                                    <Pill color="teal">
                                                        {f.missions.length} misi
                                                    </Pill>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className={bodyCls}>
                                                    {f.email}
                                                </p>
                                                <p className={mutedCls}>
                                                    {f.phone}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEdit(f)
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 transition hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Hapus"
                                                        onClick={() =>
                                                            confirmDelete(f)
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
                        {faculties.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                                <p className={mutedCls}>
                                    Halaman data fakultas
                                </p>
                                <Pagination links={faculties.links} />
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
                            {editing ? "Edit Fakultas" : "Tambah Fakultas"}
                        </DialogTitle>
                        <DialogDescription className={mutedCls}>
                            {editing
                                ? "Perbarui data fakultas lalu simpan perubahan."
                                : "Lengkapi data fakultas baru di bawah ini."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="mt-2 grid gap-5">
                        <SectionLabel>Informasi umum</SectionLabel>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Nama Fakultas"
                                required
                                error={errors.name}
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.name}
                                    placeholder="Contoh: Fakultas Teknik"
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Universitas"
                                required
                                error={errors.university}
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.university}
                                    placeholder="Contoh: Universitas Al-Khairiyah"
                                    onChange={(e) =>
                                        form.setData(
                                            "university",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>

                        <Field label="Tagline" required error={errors.tagline}>
                            <input
                                className={inputCls}
                                value={form.data.tagline}
                                placeholder="Contoh: Membangun insinyur unggul, inovatif, dan berkarakter"
                                onChange={(e) =>
                                    form.setData("tagline", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Deskripsi"
                            required
                            error={errors.description}
                        >
                            <textarea
                                rows={3}
                                className={inputCls}
                                value={form.data.description}
                                placeholder="Gambaran singkat fakultas: sejarah, keunggulan, dan program yang ditawarkan..."
                                onChange={(e) =>
                                    form.setData("description", e.target.value)
                                }
                            />
                        </Field>

                        <Field label="Gambar Hero" error={errors.hero_image}>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className={`${inputCls} file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-indigo-700 dark:file:bg-indigo-500/20 dark:file:text-indigo-300`}
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    form.setData("hero_image", file);

                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <p className={mutedCls}>
                                JPG, PNG, atau WEBP. Maks 2 MB.
                            </p>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-1 h-36 w-full rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-indigo-500/10"
                                />
                            )}
                        </Field>

                        <SectionLabel>Visi &amp; misi</SectionLabel>

                        <Field label="Visi" required error={errors.vision}>
                            <textarea
                                rows={2}
                                className={inputCls}
                                value={form.data.vision}
                                placeholder="Contoh: Menjadi fakultas teknik unggulan yang berdaya saing nasional pada tahun 2030"
                                onChange={(e) =>
                                    form.setData("vision", e.target.value)
                                }
                            />
                        </Field>

                        <div className="grid gap-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Misi
                                    <span className="ml-0.5 text-rose-500">
                                        *
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={addMission}
                                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Tambah misi
                                </button>
                            </div>

                            <div className="grid gap-2">
                                {form.data.missions.map((mission, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            className={inputCls}
                                            value={mission}
                                            placeholder={
                                                i === 0
                                                    ? "Contoh: Menyelenggarakan pendidikan teknik yang bermutu dan berkarakter"
                                                    : `Misi ${i + 1}`
                                            }
                                            onChange={(e) =>
                                                setMission(i, e.target.value)
                                            }
                                        />
                                        <button
                                            type="button"
                                            title="Hapus misi"
                                            onClick={() => removeMission(i)}
                                            className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {missionErrors.map((msg) => (
                                <p
                                    key={msg}
                                    className="text-xs font-medium text-rose-600 dark:text-rose-400"
                                >
                                    {msg}
                                </p>
                            ))}
                        </div>

                        <SectionLabel>Kontak</SectionLabel>

                        <Field label="Alamat" required error={errors.address}>
                            <input
                                className={inputCls}
                                value={form.data.address}
                                placeholder="Contoh: Jl. Jenderal Sudirman No. 12, Cilegon, Banten"
                                onChange={(e) =>
                                    form.setData("address", e.target.value)
                                }
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Email" required error={errors.email}>
                                <input
                                    type="email"
                                    className={inputCls}
                                    value={form.data.email}
                                    placeholder="Contoh: fakultas@kampus.ac.id"
                                    onChange={(e) =>
                                        form.setData("email", e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Telepon"
                                required
                                error={errors.phone}
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.phone}
                                    placeholder="Contoh: 0254-123456 atau 081234567890"
                                    onChange={(e) =>
                                        form.setData("phone", e.target.value)
                                    }
                                />
                            </Field>
                        </div>

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

FacultyIndex.layout = {
    breadcrumbs: [
        {
            title: "Fakultas",
            href: "/fakultas",
        },
    ],
};
