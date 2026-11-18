// resources/js/pages/users/index.tsx
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Eye, EyeOff, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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

type UserStatus = "active" | "non-active";

type UserRow = {
    id: number;
    name: string;
    email: string;
    status: UserStatus;
    created_at: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    users: {
        data: UserRow[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string | null };
};

type UserForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    status: UserStatus;
};

const emptyForm: UserForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    status: "active",
};

/* ------------------------------------------------------------------ */
/*  STYLE & HELPER                                                      */
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

const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

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
/** Input password dengan tombol mata untuk lihat/sembunyikan. */
function PasswordInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                className={`${inputCls} pr-11`}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                type="button"
                tabIndex={-1}
                title={visible ? "Sembunyikan password" : "Tampilkan password"}
                aria-label={
                    visible ? "Sembunyikan password" : "Tampilkan password"
                }
                aria-pressed={visible}
                onClick={() => setVisible((v) => !v)}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-indigo-700 dark:hover:bg-white/10 dark:hover:text-white"
            >
                {visible ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
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

export default function UserIndex({ users, filters }: Props) {
    const { flash, auth } = usePage<{
        flash?: { success?: string; error?: string };
        auth?: { user?: { id: number } };
    }>().props;

    const myId = auth?.user?.id;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<UserRow | null>(null);
    const [search, setSearch] = useState(filters.search ?? "");

    const form = useForm<UserForm>(emptyForm);
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
    const openCreate = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (u: UserRow) => {
        setEditing(u);
        form.clearErrors();
        form.setData({
            name: u.name,
            email: u.email,
            password: "",
            password_confirmation: "",
            status: u.status,
        });
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        form.reset();
        form.clearErrors();
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        };

        if (editing) {
            form.put(`/users/${editing.id}`, options);
        } else {
            form.post("/users", options);
        }
    };

    /* ---------- Aktif / nonaktif ---------- */
    const toggleStatus = (u: UserRow) =>
        router.put(
            `/users/${u.id}`,
            { status: u.status === "active" ? "non-active" : "active" },
            { preserveScroll: true },
        );

    /* ---------- Hapus ---------- */
    const confirmDelete = (u: UserRow) => {
        Swal.fire({
            icon: "warning",
            iconHtml: trashIcon,
            title: "Hapus pengguna ini?",
            html: `Akun <b class="text-indigo-950 dark:text-white">${esc(u.name)}</b> (${esc(u.email)}) akan dihapus permanen dan tidak dapat dikembalikan.`,
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
                router.delete(`/users/${u.id}`, { preserveScroll: true });
            }
        });
    };

    /* ---------- Pencarian ---------- */
    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/users",
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    };

    const resetSearch = () => {
        setSearch("");
        router.get("/users", {}, { preserveState: true, replace: true });
    };

    /* ---------------------------------------------------------------- */
    return (
        <>
            <Head title="Data Pengguna" />

            <div className="relative flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-4 md:p-6">
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
                                    {users.total} pengguna terdaftar
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Data Pengguna
                                </h1>
                                <p className="mt-2 text-base leading-relaxed text-indigo-100">
                                    Kelola akun admin yang dapat masuk ke
                                    dashboard dan mengelola konten website.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-teal-300 hover:text-indigo-950"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Pengguna
                            </button>
                        </div>
                    </section>
                </Reveal>

                {/* ============ TABEL ============ */}
                <Reveal delay={stagger(1)} className="relative">
                    <section className={`${card} !p-0 overflow-hidden`}>
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-white/10"
                        >
                            <div>
                                <h2 className={titleCls}>Daftar pengguna</h2>
                                <p className={mutedCls}>
                                    {users.total > 0
                                        ? `Menampilkan ${users.from}–${users.to} dari ${users.total} data`
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
                                        placeholder="Cari nama atau email..."
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

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
                                    <tr>
                                        <th className="w-14 px-5 py-3">No</th>
                                        <th className="px-5 py-3">Pengguna</th>
                                        <th className="w-36 px-5 py-3">
                                            Status
                                        </th>
                                        <th className="w-40 px-5 py-3">
                                            Terdaftar
                                        </th>
                                        <th className="w-28 px-5 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-5 py-14"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                        <Users className="h-7 w-7" />
                                                    </span>
                                                    <p className={mutedCls}>
                                                        {filters.search
                                                            ? "Data tidak ditemukan."
                                                            : "Belum ada data pengguna."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {users.data.map((u, i) => {
                                        const isMe = u.id === myId;

                                        return (
                                            <tr
                                                key={u.id}
                                                className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                            >
                                                <td
                                                    className={`px-5 py-4 tabular-nums ${bodyCls}`}
                                                >
                                                    {(users.from ?? 1) + i}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-500/10">
                                                            {initials(u.name)}
                                                        </span>
                                                        <div>
                                                            <p className="font-semibold text-indigo-950 dark:text-white">
                                                                {u.name}
                                                                {isMe && (
                                                                    <span className="ml-2 rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                                                                        Kamu
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p
                                                                className={
                                                                    mutedCls
                                                                }
                                                            >
                                                                {u.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <button
                                                        type="button"
                                                        disabled={isMe}
                                                        title={
                                                            isMe
                                                                ? "Tidak bisa mengubah status akun sendiri"
                                                                : "Klik untuk mengubah status"
                                                        }
                                                        onClick={() =>
                                                            toggleStatus(u)
                                                        }
                                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed ${
                                                            u.status ===
                                                            "active"
                                                                ? "bg-teal-100 text-teal-700 enabled:hover:bg-teal-200 dark:bg-teal-500/20 dark:text-teal-300 dark:enabled:hover:bg-teal-500/30"
                                                                : "bg-slate-100 text-slate-500 enabled:hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400 dark:enabled:hover:bg-white/15"
                                                        }`}
                                                    >
                                                        {u.status === "active"
                                                            ? "Aktif"
                                                            : "Nonaktif"}
                                                    </button>
                                                </td>
                                                <td
                                                    className={`px-5 py-4 ${bodyCls}`}
                                                >
                                                    {formatDate(u.created_at)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            title="Edit"
                                                            onClick={() =>
                                                                openEdit(u)
                                                            }
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700 transition hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title={
                                                                isMe
                                                                    ? "Tidak bisa menghapus akun sendiri"
                                                                    : "Hapus"
                                                            }
                                                            disabled={isMe}
                                                            onClick={() =>
                                                                confirmDelete(u)
                                                            }
                                                            className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-rose-700 transition enabled:hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-rose-500/20 dark:text-rose-300 dark:enabled:hover:bg-rose-500/30"
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

                        {users.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-white/10">
                                <p className={mutedCls}>
                                    Halaman data pengguna
                                </p>
                                <Pagination links={users.links} />
                            </div>
                        )}
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
                            {editing ? "Edit Pengguna" : "Tambah Pengguna"}
                        </DialogTitle>
                        <DialogDescription className={mutedCls}>
                            {editing
                                ? "Perbarui data akun lalu simpan perubahan."
                                : "Lengkapi data akun baru di bawah ini."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="mt-2 grid gap-5">
                        <Field label="Nama" required error={errors.name}>
                            <input
                                className={inputCls}
                                value={form.data.name}
                                placeholder="Contoh: Budi Santoso"
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                            />
                        </Field>

                        <Field label="Email" required error={errors.email}>
                            <input
                                type="email"
                                className={inputCls}
                                value={form.data.email}
                                placeholder="Contoh: budi@alkhairiyah.ac.id"
                                onChange={(e) =>
                                    form.setData("email", e.target.value)
                                }
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Password"
                                required={!editing}
                                error={errors.password}
                            >
                                <PasswordInput
                                    value={form.data.password}
                                    placeholder="Minimal 8 karakter"
                                    onChange={(v) =>
                                        form.setData("password", v)
                                    }
                                />
                            </Field>
                            <Field
                                label="Konfirmasi password"
                                required={!editing}
                            >
                                <PasswordInput
                                    value={form.data.password_confirmation}
                                    placeholder="Ulangi password"
                                    onChange={(v) =>
                                        form.setData("password_confirmation", v)
                                    }
                                />
                            </Field>
                        </div>
                        {editing && (
                            <p className={`-mt-3 ${mutedCls}`}>
                                Kosongkan password jika tidak ingin diganti.
                            </p>
                        )}

                        <Field label="Status" required error={errors.status}>
                            <select
                                className={inputCls}
                                value={form.data.status}
                                disabled={editing?.id === myId}
                                onChange={(e) =>
                                    form.setData(
                                        "status",
                                        e.target.value as UserStatus,
                                    )
                                }
                            >
                                <option value="active">Aktif</option>
                                <option value="non-active">Nonaktif</option>
                            </select>
                            <p className={mutedCls}>
                                Akun nonaktif tidak dapat masuk ke dashboard.
                            </p>
                        </Field>

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

UserIndex.layout = {
    breadcrumbs: [
        {
            title: "Pengguna",
            href: "/users",
        },
    ],
};
