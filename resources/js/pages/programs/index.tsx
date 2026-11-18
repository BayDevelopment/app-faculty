// resources/js/pages/programs/index.tsx
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    BookOpen,
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
    type RefObject,
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

/** Asumsi bentuk data kurikulum di DB: [{ semester: string, courses: string[] }] */
type CurriculumItem = { semester: string; courses: string[] };

type Program = {
    id: number;
    slug: string;
    name: string;
    degree: string;
    accreditation: string;
    description: string;
    hero_image: string | null;
    overview: string | null;
    vision: string | null;
    duration: string | null;
    credits: number | null;
    head_name: string | null;
    head_title: string | null;
    head_photo: string | null;
    competencies: string[] | null;
    curriculum: CurriculumItem[] | null;
    career_prospects: string[] | null;
    facilities: string[] | null;
    admission_requirements: string[] | null;
    contact_email: string | null;
    contact_phone: string | null;
    student_count: number;
    sort_order: number;
    is_active: boolean;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    programs: {
        data: Program[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
    options: { degrees: string[]; accreditations: string[] };
};

/** Di form, mata kuliah per semester ditulis satu per baris (string). */
type CurriculumFormItem = { semester: string; courses: string };

type ListKey =
    | "competencies"
    | "career_prospects"
    | "facilities"
    | "admission_requirements";

type ProgramForm = {
    name: string;
    slug: string;
    degree: string;
    accreditation: string;
    description: string;
    hero_image: File | null;
    overview: string;
    vision: string;
    duration: string;
    credits: string;
    head_name: string;
    head_title: string;
    head_photo: File | null;
    competencies: string[];
    curriculum: CurriculumFormItem[];
    career_prospects: string[];
    facilities: string[];
    admission_requirements: string[];
    contact_email: string;
    contact_phone: string;
    student_count: string;
    sort_order: string;
    is_active: boolean;
};

const emptyForm: ProgramForm = {
    name: "",
    slug: "",
    degree: "S1",
    accreditation: "Baik",
    description: "",
    hero_image: null,
    overview: "",
    vision: "",
    duration: "",
    credits: "",
    head_name: "",
    head_title: "",
    head_photo: null,
    competencies: [""],
    curriculum: [{ semester: "", courses: "" }],
    career_prospects: [""],
    facilities: [""],
    admission_requirements: [""],
    contact_email: "",
    contact_phone: "",
    student_count: "0",
    sort_order: "0",
    is_active: true,
};

/* ------------------------------------------------------------------ */
/*  STYLE & HELPER (sama dengan halaman fakultas)                       */
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
const btnAddSmall =
    "inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30";
const btnRemoveSmall =
    "grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700 transition hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30";

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

const toForm = (list: string[] | null | undefined) =>
    list?.length ? list : [""];

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

const accreditationColor = (a: string): PillColor =>
    a === "Unggul" ? "teal" : a === "Baik Sekali" ? "indigo" : "amber";

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

function ErrorList({ messages }: { messages: string[] }) {
    return (
        <>
            {messages.map((msg) => (
                <p
                    key={msg}
                    className="text-xs font-medium text-rose-600 dark:text-rose-400"
                >
                    {msg}
                </p>
            ))}
        </>
    );
}

/** Daftar teks dinamis (kompetensi, prospek karier, fasilitas, persyaratan). */
function ListField({
    label,
    values,
    onChange,
    placeholder,
    addLabel,
    errors,
}: {
    label: string;
    values: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
    addLabel: string;
    errors: string[];
}) {
    const setItem = (index: number, value: string) =>
        onChange(values.map((v, i) => (i === index ? value : v)));
    const addItem = () => onChange([...values, ""]);
    const removeItem = (index: number) =>
        onChange(
            values.length > 1 ? values.filter((_, i) => i !== index) : [""],
        );

    return (
        <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}
                </span>
                <button type="button" onClick={addItem} className={btnAddSmall}>
                    <Plus className="h-3.5 w-3.5" />
                    {addLabel}
                </button>
            </div>

            <div className="grid gap-2">
                {values.map((value, i) => (
                    <div key={i} className="flex gap-2">
                        <input
                            className={inputCls}
                            value={value}
                            placeholder={
                                i === 0 ? placeholder : `${label} ${i + 1}`
                            }
                            onChange={(e) => setItem(i, e.target.value)}
                        />
                        <button
                            type="button"
                            title="Hapus"
                            onClick={() => removeItem(i)}
                            className={btnRemoveSmall}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <ErrorList messages={errors} />
        </div>
    );
}

/** Input file + preview. */
function ImageField({
    label,
    inputRef,
    preview,
    error,
    previewClass,
    onPick,
}: {
    label: string;
    inputRef: RefObject<HTMLInputElement | null>;
    preview: string | null;
    error?: string;
    previewClass: string;
    onPick: (file: File | null) => void;
}) {
    return (
        <Field label={label} error={error}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className={fileCls}
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <p className={mutedCls}>JPG, PNG, atau WEBP. Maks 2 MB.</p>
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className={`mt-1 rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-indigo-500/10 ${previewClass}`}
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

export default function ProgramIndex({ programs, filters, options }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Program | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [headPreview, setHeadPreview] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search ?? "");
    const heroRef = useRef<HTMLInputElement>(null);
    const headRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProgramForm>(emptyForm);
    const errors = form.errors as Record<string, string>;

    /** Semua pesan error milik satu field (termasuk "field.0", "field.0.sub"). */
    const errorsFor = (name: string) =>
        Array.from(
            new Set(
                Object.entries(errors)
                    .filter(([k]) => k === name || k.startsWith(`${name}.`))
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
    const resetFiles = () => {
        if (heroRef.current) {
            heroRef.current.value = "";
        }

        if (headRef.current) {
            headRef.current.value = "";
        }
    };

    const openCreate = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
        resetFiles();
        setHeroPreview(null);
        setHeadPreview(null);
        setOpen(true);
    };

    const openEdit = (p: Program) => {
        setEditing(p);
        form.clearErrors();
        form.setData({
            name: p.name,
            slug: p.slug,
            degree: p.degree,
            accreditation: p.accreditation,
            description: p.description,
            hero_image: null,
            overview: p.overview ?? "",
            vision: p.vision ?? "",
            duration: p.duration ?? "",
            credits: p.credits != null ? String(p.credits) : "",
            head_name: p.head_name ?? "",
            head_title: p.head_title ?? "",
            head_photo: null,
            competencies: toForm(p.competencies),
            curriculum: p.curriculum?.length
                ? p.curriculum.map((c) => ({
                      semester: c.semester ?? "",
                      courses: Array.isArray(c.courses)
                          ? c.courses.join("\n")
                          : "",
                  }))
                : [{ semester: "", courses: "" }],
            career_prospects: toForm(p.career_prospects),
            facilities: toForm(p.facilities),
            admission_requirements: toForm(p.admission_requirements),
            contact_email: p.contact_email ?? "",
            contact_phone: p.contact_phone ?? "",
            student_count: String(p.student_count),
            sort_order: String(p.sort_order),
            is_active: p.is_active,
        });
        resetFiles();
        setHeroPreview(p.hero_image ? `/storage/${p.hero_image}` : null);
        setHeadPreview(p.head_photo ? `/storage/${p.head_photo}` : null);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        form.reset();
        form.clearErrors();
        resetFiles();
        setHeroPreview(null);
        setHeadPreview(null);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                closeModal();

                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: editing
                        ? "Program studi berhasil diperbarui."
                        : "Program studi berhasil ditambahkan.",
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

        const withCourses = (data: ProgramForm) => ({
            ...data,
            curriculum: data.curriculum.map((c) => ({
                semester: c.semester,
                courses: c.courses
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
            })),
        });

        if (editing) {
            form.transform((data) => ({
                ...withCourses(data),
                _method: "put",
            }));

            form.post(`/prodi/${editing.id}`, options);
        } else {
            form.transform((data) => withCourses(data));
            form.post("/prodi", options);
        }
    };

    /* ---------- Helper form ---------- */
    const setList = (key: ListKey) => (next: string[]) =>
        form.setData(key, next);

    const setCurriculum = (next: CurriculumFormItem[]) =>
        form.setData("curriculum", next);

    const updateSemester = (
        index: number,
        patch: Partial<CurriculumFormItem>,
    ) =>
        setCurriculum(
            form.data.curriculum.map((c, i) =>
                i === index ? { ...c, ...patch } : c,
            ),
        );

    const addSemester = () =>
        setCurriculum([...form.data.curriculum, { semester: "", courses: "" }]);

    const removeSemester = (index: number) =>
        setCurriculum(
            form.data.curriculum.length > 1
                ? form.data.curriculum.filter((_, i) => i !== index)
                : [{ semester: "", courses: "" }],
        );

    /* ---------- Hapus ---------- */
    const confirmDelete = (p: Program) => {
        Swal.fire({
            icon: "warning",
            iconHtml: trashIcon,
            title: "Hapus program studi ini?",
            html: `Data <b class="text-indigo-950 dark:text-white">${esc(p.name)} (${esc(p.degree)})</b> akan dihapus permanen beserta gambarnya dan tidak dapat dikembalikan.`,
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
                router.delete(`/prodi/${p.id}`, { preserveScroll: true });
            }
        });
    };

    /* ---------- Pencarian ---------- */
    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/prodi",
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    };

    const resetSearch = () => {
        setSearch("");
        router.get("/prodi", {}, { preserveState: true, replace: true });
    };

    /* ---------------------------------------------------------------- */
    return (
        <>
            <Head title="Data Program Studi" />

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
                                    {programs.total} program studi terdaftar
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Data Program Studi
                                </h1>
                                <p className="mt-2 text-base leading-relaxed text-indigo-100">
                                    Kelola profil, kurikulum, prospek karier,
                                    dan kontak program studi yang tampil di
                                    website.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Program Studi
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
                                <h2 className={titleCls}>
                                    Daftar program studi
                                </h2>
                                <p className={mutedCls}>
                                    {programs.total > 0
                                        ? `Menampilkan ${programs.from}–${programs.to} dari ${programs.total} data`
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
                                        placeholder="Cari nama, slug, jenjang, kaprodi..."
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
                                        <th className="px-5 py-3">
                                            Program studi
                                        </th>
                                        <th className="px-5 py-3">
                                            Akreditasi
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Mahasiswa
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
                                    {programs.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-5 py-14"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                        <BookOpen className="h-7 w-7" />
                                                    </span>
                                                    <p className={mutedCls}>
                                                        {filters.search
                                                            ? "Data tidak ditemukan."
                                                            : "Belum ada data program studi."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {programs.data.map((p, i) => (
                                        <tr
                                            key={p.id}
                                            className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                        >
                                            <td
                                                className={`px-5 py-4 tabular-nums ${bodyCls}`}
                                            >
                                                {(programs.from ?? 1) + i}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Thumb
                                                    key={p.hero_image}
                                                    src={
                                                        p.hero_image
                                                            ? `/storage/${p.hero_image}`
                                                            : null
                                                    }
                                                    alt={p.name}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold text-indigo-950 dark:text-white">
                                                        {p.name}
                                                    </p>
                                                    <Pill>{p.degree}</Pill>
                                                </div>
                                                <p className={mutedCls}>
                                                    /{p.slug}
                                                </p>
                                                {p.head_name && (
                                                    <p
                                                        className={`${mutedCls} line-clamp-1`}
                                                    >
                                                        Kaprodi: {p.head_name}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Pill
                                                    color={accreditationColor(
                                                        p.accreditation,
                                                    )}
                                                >
                                                    {p.accreditation}
                                                </Pill>
                                            </td>
                                            <td
                                                className={`px-5 py-4 text-right tabular-nums ${bodyCls}`}
                                            >
                                                {p.student_count.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </td>
                                            <td
                                                className={`px-5 py-4 text-center tabular-nums ${bodyCls}`}
                                            >
                                                {p.sort_order}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Pill
                                                    color={
                                                        p.is_active
                                                            ? "teal"
                                                            : "slate"
                                                    }
                                                >
                                                    {p.is_active
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
                                                            openEdit(p)
                                                        }
                                                        className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 transition hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Hapus"
                                                        onClick={() =>
                                                            confirmDelete(p)
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
                        {programs.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                                <p className={mutedCls}>
                                    Halaman data program studi
                                </p>
                                <Pagination links={programs.links} />
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
                            {editing
                                ? "Edit Program Studi"
                                : "Tambah Program Studi"}
                        </DialogTitle>
                        <DialogDescription className={mutedCls}>
                            {editing
                                ? "Perbarui data program studi lalu simpan perubahan."
                                : "Lengkapi data program studi baru di bawah ini."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="mt-2 grid gap-5">
                        {/* ---- Informasi umum ---- */}
                        <SectionLabel>Informasi umum</SectionLabel>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Nama Program Studi"
                                required
                                error={errors.name}
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.name}
                                    placeholder="Contoh: Teknik Informatika"
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Slug"
                                error={errors.slug}
                                hint={
                                    editing
                                        ? "Ubah hanya jika perlu, karena akan mengubah URL halaman."
                                        : "Kosongkan untuk dibuat otomatis dari nama."
                                }
                            >
                                <input
                                    className={inputCls}
                                    value={form.data.slug}
                                    placeholder="teknik-informatika"
                                    onChange={(e) =>
                                        form.setData("slug", e.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Jenjang"
                                required
                                error={errors.degree}
                            >
                                <select
                                    className={inputCls}
                                    value={form.data.degree}
                                    onChange={(e) =>
                                        form.setData("degree", e.target.value)
                                    }
                                >
                                    {options.degrees.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                label="Akreditasi"
                                required
                                error={errors.accreditation}
                            >
                                <select
                                    className={inputCls}
                                    value={form.data.accreditation}
                                    onChange={(e) =>
                                        form.setData(
                                            "accreditation",
                                            e.target.value,
                                        )
                                    }
                                >
                                    {options.accreditations.map((a) => (
                                        <option key={a} value={a}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Lama Studi" error={errors.duration}>
                                <input
                                    className={inputCls}
                                    value={form.data.duration}
                                    placeholder="Contoh: 8 semester"
                                    onChange={(e) =>
                                        form.setData("duration", e.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Total SKS" error={errors.credits}>
                                <input
                                    type="number"
                                    min={0}
                                    className={inputCls}
                                    value={form.data.credits}
                                    placeholder="Contoh: 144"
                                    onChange={(e) =>
                                        form.setData("credits", e.target.value)
                                    }
                                />
                            </Field>
                        </div>

                        {/* ---- Deskripsi ---- */}
                        <SectionLabel>Deskripsi</SectionLabel>

                        <Field
                            label="Deskripsi singkat"
                            required
                            error={errors.description}
                            hint="Tampil di kartu daftar program studi."
                        >
                            <textarea
                                rows={3}
                                className={inputCls}
                                value={form.data.description}
                                placeholder="Ringkasan satu-dua kalimat tentang program studi..."
                                onChange={(e) =>
                                    form.setData("description", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="Ikhtisar"
                            error={errors.overview}
                            hint="Penjelasan lengkap untuk halaman detail."
                        >
                            <textarea
                                rows={5}
                                className={inputCls}
                                value={form.data.overview}
                                placeholder="Latar belakang, fokus keilmuan, dan keunggulan program studi..."
                                onChange={(e) =>
                                    form.setData("overview", e.target.value)
                                }
                            />
                        </Field>

                        <Field label="Visi" error={errors.vision}>
                            <textarea
                                rows={2}
                                className={inputCls}
                                value={form.data.vision}
                                placeholder="Contoh: Menjadi program studi unggulan di bidang..."
                                onChange={(e) =>
                                    form.setData("vision", e.target.value)
                                }
                            />
                        </Field>

                        <ImageField
                            label="Gambar Hero"
                            inputRef={heroRef}
                            preview={heroPreview}
                            error={errors.hero_image}
                            previewClass="h-36 w-full"
                            onPick={(file) => {
                                form.setData("hero_image", file);

                                if (file) {
                                    setHeroPreview(URL.createObjectURL(file));
                                }
                            }}
                        />

                        {/* ---- Ketua program studi ---- */}
                        <SectionLabel>Ketua program studi</SectionLabel>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Nama" error={errors.head_name}>
                                <input
                                    className={inputCls}
                                    value={form.data.head_name}
                                    placeholder="Contoh: Dr. Budi Santoso, M.Kom."
                                    onChange={(e) =>
                                        form.setData(
                                            "head_name",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field label="Jabatan" error={errors.head_title}>
                                <input
                                    className={inputCls}
                                    value={form.data.head_title}
                                    placeholder="Contoh: Ketua Program Studi"
                                    onChange={(e) =>
                                        form.setData(
                                            "head_title",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>

                        <ImageField
                            label="Foto Ketua Program Studi"
                            inputRef={headRef}
                            preview={headPreview}
                            error={errors.head_photo}
                            previewClass="h-28 w-28"
                            onPick={(file) => {
                                form.setData("head_photo", file);

                                if (file) {
                                    setHeadPreview(URL.createObjectURL(file));
                                }
                            }}
                        />

                        {/* ---- Akademik ---- */}
                        <SectionLabel>Akademik</SectionLabel>

                        <ListField
                            label="Kompetensi lulusan"
                            values={form.data.competencies}
                            onChange={setList("competencies")}
                            placeholder="Contoh: Mampu merancang dan membangun perangkat lunak"
                            addLabel="Tambah kompetensi"
                            errors={errorsFor("competencies")}
                        />

                        {/* Kurikulum */}
                        <div className="grid gap-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Kurikulum
                                </span>
                                <button
                                    type="button"
                                    onClick={addSemester}
                                    className={btnAddSmall}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Tambah semester
                                </button>
                            </div>

                            <div className="grid gap-3">
                                {form.data.curriculum.map((c, i) => (
                                    <div
                                        key={i}
                                        className="grid gap-2 rounded-2xl border border-slate-200 p-4 dark:border-white/10"
                                    >
                                        <div className="flex gap-2">
                                            <input
                                                className={inputCls}
                                                value={c.semester}
                                                placeholder={`Contoh: Semester ${i + 1}`}
                                                onChange={(e) =>
                                                    updateSemester(i, {
                                                        semester:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <button
                                                type="button"
                                                title="Hapus semester"
                                                onClick={() =>
                                                    removeSemester(i)
                                                }
                                                className={btnRemoveSmall}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <textarea
                                            rows={4}
                                            className={inputCls}
                                            value={c.courses}
                                            placeholder={
                                                "Satu mata kuliah per baris\nContoh: Algoritma dan Pemrograman"
                                            }
                                            onChange={(e) =>
                                                updateSemester(i, {
                                                    courses: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                            <ErrorList messages={errorsFor("curriculum")} />
                        </div>

                        <ListField
                            label="Prospek karier"
                            values={form.data.career_prospects}
                            onChange={setList("career_prospects")}
                            placeholder="Contoh: Software Engineer"
                            addLabel="Tambah prospek"
                            errors={errorsFor("career_prospects")}
                        />

                        <ListField
                            label="Fasilitas"
                            values={form.data.facilities}
                            onChange={setList("facilities")}
                            placeholder="Contoh: Laboratorium Komputer"
                            addLabel="Tambah fasilitas"
                            errors={errorsFor("facilities")}
                        />

                        <ListField
                            label="Persyaratan penerimaan"
                            values={form.data.admission_requirements}
                            onChange={setList("admission_requirements")}
                            placeholder="Contoh: Lulusan SMA/SMK/MA sederajat"
                            addLabel="Tambah persyaratan"
                            errors={errorsFor("admission_requirements")}
                        />

                        {/* ---- Kontak ---- */}
                        <SectionLabel>Kontak</SectionLabel>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Email" error={errors.contact_email}>
                                <input
                                    type="email"
                                    className={inputCls}
                                    value={form.data.contact_email}
                                    placeholder="Contoh: prodi@kampus.ac.id"
                                    onChange={(e) =>
                                        form.setData(
                                            "contact_email",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field label="Telepon" error={errors.contact_phone}>
                                <input
                                    className={inputCls}
                                    value={form.data.contact_phone}
                                    placeholder="Contoh: 0254-123456"
                                    onChange={(e) =>
                                        form.setData(
                                            "contact_phone",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>

                        {/* ---- Tampilan & data ---- */}
                        <SectionLabel>Tampilan &amp; data</SectionLabel>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Jumlah Mahasiswa"
                                error={errors.student_count}
                            >
                                <input
                                    type="number"
                                    min={0}
                                    className={inputCls}
                                    value={form.data.student_count}
                                    onChange={(e) =>
                                        form.setData(
                                            "student_count",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Urutan Tampil"
                                error={errors.sort_order}
                                hint="Angka kecil tampil lebih dulu."
                            >
                                <input
                                    type="number"
                                    min={0}
                                    className={inputCls}
                                    value={form.data.sort_order}
                                    onChange={(e) =>
                                        form.setData(
                                            "sort_order",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>

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
                                    Program studi nonaktif tidak muncul di
                                    halaman publik.
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

ProgramIndex.layout = {
    breadcrumbs: [
        {
            title: "Program Studi",
            href: "/prodi",
        },
    ],
};
