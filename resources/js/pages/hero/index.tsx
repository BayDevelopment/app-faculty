// resources/js/pages/hero/index.tsx
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    ImageIcon,
    ImageOff,
    Images,
    Pencil,
    Plus,
    Trash2,
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

type HeroPhoto = {
    id: number;
    posisi: number;
    url: string;
    alt: string | null;
    is_active: boolean;
};

type Props = {
    photos: HeroPhoto[];
};

type PhotoForm = {
    gambar: File | null;
    alt: string;
    posisi: string;
    is_active: boolean;
};

const emptyForm: PhotoForm = {
    gambar: null,
    alt: "",
    posisi: "",
    is_active: true,
};

/* ------------------------------------------------------------------ */
/*  STYLE & HELPER (sama dengan halaman fakultas)                       */
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

/** Thumbnail: ImageIcon = belum ada gambar, ImageOff = gambar gagal dimuat. */
function Thumb({ src, alt }: { src: string | null; alt: string }) {
    const [failed, setFailed] = useState(false);

    if (!src) {
        return (
            <span
                title="Belum ada gambar"
                className="grid h-14 w-24 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/10"
            >
                <ImageIcon className="h-5 w-5" />
            </span>
        );
    }

    if (failed) {
        return (
            <span
                title={`Gambar gagal dimuat: ${src}`}
                className="grid h-14 w-24 place-items-center rounded-xl bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
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
            className="h-14 w-24 rounded-xl bg-indigo-100 object-cover ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:ring-indigo-500/10"
        />
    );
}

/* ------------------------------------------------------------------ */
/*  HALAMAN                                                             */
/* ------------------------------------------------------------------ */

export default function HeroPhotoIndex({ photos }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<HeroPhoto | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const form = useForm<PhotoForm>(emptyForm);
    const errors = form.errors as Record<string, string>;

    const activeCount = photos.filter((p) => p.is_active).length;

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

    const openEdit = (p: HeroPhoto) => {
        setEditing(p);
        form.clearErrors();
        form.setData({
            gambar: null,
            alt: p.alt ?? "",
            posisi: String(p.posisi),
            is_active: p.is_active,
        });
        resetFile();
        setPreview(p.url);
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
            form.post(`/foto-beranda/${editing.id}`, options);
        } else {
            // saat tambah, urutan & status ditentukan server
            form.transform((data) => ({ gambar: data.gambar, alt: data.alt }));
            form.post("/foto-beranda", options);
        }
    };

    /* ---------- Aktif / nonaktif ---------- */
    const toggleActive = (p: HeroPhoto) =>
        router.put(
            `/foto-beranda/${p.id}`,
            { is_active: !p.is_active },
            { preserveScroll: true },
        );

    /* ---------- Hapus ---------- */
    const confirmDelete = (p: HeroPhoto) => {
        Swal.fire({
            icon: "warning",
            iconHtml: trashIcon,
            title: "Hapus foto ini?",
            html: `Foto <b class="text-indigo-950 dark:text-white">${esc(p.alt || `urutan ${p.posisi}`)}</b> akan dihapus permanen dan tidak dapat dikembalikan.`,
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
                router.delete(`/foto-beranda/${p.id}`, {
                    preserveScroll: true,
                });
            }
        });
    };

    /* ---------------------------------------------------------------- */
    return (
        <>
            <Head title="Foto Beranda" />

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
                                    {activeCount} dari {photos.length} foto
                                    aktif
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Foto Beranda
                                </h1>
                                <p className="mt-2 text-base leading-relaxed text-indigo-100">
                                    Kelola foto yang berjalan otomatis di bagian
                                    atas website. Urutan ganjil tampil di kolom
                                    kiri, urutan genap di kolom kanan.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Foto
                            </button>
                        </div>
                    </section>
                </Reveal>

                {/* ============ TABEL ============ */}
                <Reveal delay={stagger(1)} className="relative">
                    <section className={`${card} !p-0 overflow-hidden`}>
                        <div className="border-b border-slate-200 p-5 dark:border-white/10">
                            <h2 className={titleCls}>Daftar foto</h2>
                            <p className={mutedCls}>
                                {photos.length > 0
                                    ? `${photos.length} foto, diurutkan berdasarkan urutan tampil`
                                    : "Belum ada data"}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                                    <tr>
                                        <th className="w-14 px-5 py-3">No</th>
                                        <th className="w-32 px-5 py-3">Foto</th>
                                        <th className="px-5 py-3">
                                            Keterangan
                                        </th>
                                        <th className="w-28 px-5 py-3">
                                            Urutan
                                        </th>
                                        <th className="w-32 px-5 py-3">
                                            Status
                                        </th>
                                        <th className="w-28 px-5 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                    {photos.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-5 py-14"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                        <Images className="h-7 w-7" />
                                                    </span>
                                                    <p className={mutedCls}>
                                                        Belum ada foto beranda.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {photos.map((p, i) => (
                                        <tr
                                            key={p.id}
                                            className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                        >
                                            <td
                                                className={`px-5 py-4 tabular-nums ${bodyCls}`}
                                            >
                                                {i + 1}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Thumb
                                                    key={p.url}
                                                    src={p.url}
                                                    alt={p.alt ?? ""}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <p
                                                    className={`font-semibold ${
                                                        p.alt
                                                            ? "text-indigo-950 dark:text-white"
                                                            : "italic text-slate-400"
                                                    }`}
                                                >
                                                    {p.alt ||
                                                        "Tanpa keterangan"}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                    #{p.posisi}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    title="Klik untuk mengubah status"
                                                    onClick={() =>
                                                        toggleActive(p)
                                                    }
                                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                                        p.is_active
                                                            ? "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-500/20 dark:text-teal-300 dark:hover:bg-teal-500/30"
                                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/15"
                                                    }`}
                                                >
                                                    {p.is_active
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </button>
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
                    </section>
                </Reveal>
            </div>

            {/* ============ MODAL CREATE / EDIT ============ */}
            <Dialog open={open} onOpenChange={(v) => !v && closeModal()}>
                <DialogContent
                    className="max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 bg-white p-6 sm:max-w-lg sm:p-8 dark:border-white/10 dark:bg-indigo-950"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className={titleCls}>
                            {editing ? "Edit Foto" : "Tambah Foto"}
                        </DialogTitle>
                        <DialogDescription className={mutedCls}>
                            {editing
                                ? "Ganti foto, keterangan, urutan, atau status lalu simpan."
                                : "Unggah foto baru, otomatis ditaruh di urutan paling akhir."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="mt-2 grid gap-5">
                        <Field
                            label="Foto"
                            required={!editing}
                            error={errors.gambar}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className={`${inputCls} file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-indigo-700 dark:file:bg-indigo-500/20 dark:file:text-indigo-300`}
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    form.setData("gambar", file);

                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <p className={mutedCls}>
                                JPG, PNG, atau WEBP. Maks 3 MB.
                                {editing && " Kosongkan jika tidak diganti."}
                            </p>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-1 h-44 w-full rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-indigo-500/10"
                                />
                            )}
                        </Field>

                        <Field label="Keterangan foto" error={errors.alt}>
                            <input
                                className={inputCls}
                                value={form.data.alt}
                                placeholder="Contoh: Mahasiswa praktikum di laboratorium"
                                onChange={(e) =>
                                    form.setData("alt", e.target.value)
                                }
                            />
                            <p className={mutedCls}>
                                Dipakai sebagai teks alternatif untuk
                                aksesibilitas.
                            </p>
                        </Field>

                        {editing && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Urutan" error={errors.posisi}>
                                    <input
                                        type="number"
                                        min={1}
                                        className={inputCls}
                                        value={form.data.posisi}
                                        onChange={(e) =>
                                            form.setData(
                                                "posisi",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field label="Status" error={errors.is_active}>
                                    <label className="flex h-[42px] cursor-pointer items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_active}
                                            onChange={(e) =>
                                                form.setData(
                                                    "is_active",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-slate-300 accent-indigo-700"
                                        />
                                        Tampilkan di beranda
                                    </label>
                                </Field>
                            </div>
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

HeroPhotoIndex.layout = {
    breadcrumbs: [
        {
            title: "Foto Beranda",
            href: "/foto-beranda",
        },
    ],
};
