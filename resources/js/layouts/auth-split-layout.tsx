import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import Blob from "@/components/blob";
import Reveal from "@/components/reveal";

type SharedFaculty = { name: string; university: string };

const FALLBACK: SharedFaculty = {
    name: "Fakultas Teknik dan Sains",
    university: "Universitas Contoh Nusantara",
};

type Props = {
    children: ReactNode;
    title: string;
    description?: string;
};

function Brand({
    info,
    light = false,
}: {
    info: SharedFaculty;
    light?: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
            </span>
            <span className="leading-tight">
                <span
                    className={`block text-sm font-bold ${light ? "text-white" : "text-indigo-950"}`}
                >
                    {info.name}
                </span>
                <span
                    className={`block text-xs ${light ? "text-indigo-300" : "text-slate-500"}`}
                >
                    {info.university}
                </span>
            </span>
        </div>
    );
}

/**
 * Kerangka halaman autentikasi: panel merek di kiri (desktop) dan kartu form di kanan.
 * Dipakai lewat `Page.layout` supaya semua halaman auth tampil seragam.
 */
export default function AuthSplitLayout({
    children,
    title,
    description,
}: Props) {
    const shared = usePage<{ faculty?: SharedFaculty }>().props.faculty;
    const info = shared ?? FALLBACK;

    return (
        <div className="grid min-h-screen bg-slate-50 font-sans text-slate-800 antialiased lg:grid-cols-2">
            {/* ============ PANEL KIRI (desktop) ============ */}
            <aside className="relative hidden overflow-hidden bg-gradient-to-b from-indigo-950 to-indigo-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
                <Blob className="-left-24 -top-24 h-96 w-96 bg-gradient-to-br from-indigo-500/40 to-sky-400/20" />
                <Blob className="-bottom-24 -right-24 h-96 w-96 bg-gradient-to-br from-teal-400/30 to-emerald-300/10" />

                <div className="relative">
                    <Brand info={info} light />
                </div>

                <div className="relative max-w-md">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
                        Kelola informasi fakultas dengan mudah.
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-indigo-200">
                        Masuk untuk memperbarui berita, program studi, dan
                        layanan yang tampil di situs fakultas.
                    </p>
                </div>

                <p className="relative text-sm text-indigo-300">
                    © {new Date().getFullYear()} {info.name}
                </p>
            </aside>

            {/* ============ PANEL KANAN ============ */}
            <main className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
                {/* Latar lembut untuk mobile dan tablet */}
                <div className="lg:hidden">
                    <Blob className="-left-24 -top-24 h-72 w-72 bg-gradient-to-br from-indigo-300/50 to-sky-200/40" />
                    <Blob className="-bottom-24 -right-24 h-72 w-72 bg-gradient-to-br from-teal-200/50 to-emerald-100/40" />
                </div>

                <div className="relative w-full max-w-md">
                    <Reveal className="lg:hidden">
                        <div className="mb-8">
                            <Brand info={info} />
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-2 text-slate-600">{description}</p>
                        )}
                    </Reveal>

                    <Reveal delay={160} className="mt-8">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-900/5 sm:p-8">
                            {children}
                        </div>
                    </Reveal>

                    <Reveal delay={240}>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke beranda
                        </Link>
                    </Reveal>
                </div>
            </main>
        </div>
    );
}
