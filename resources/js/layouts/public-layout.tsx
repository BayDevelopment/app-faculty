import { usePage } from "@inertiajs/react";
import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import Blob from "@/components/blob";

export type FacultyInfo = {
    name: string;
    university: string;
    description: string;
    address: string;
    email: string;
    phone: string;
};

// Memakai "/#..." supaya tautan tetap benar saat dibuka dari halaman selain beranda.
export const NAV = [
    { label: "Beranda", href: "/#beranda" },
    { label: "Visi dan misi", href: "/#visi-misi" },
    { label: "Program studi", href: "/#prodi" },
    { label: "Layanan", href: "/#layanan" },
    { label: "Berita", href: "/#berita" },
    { label: "Alumni", href: "/#alumni" },
    { label: "Lokasi", href: "/#lokasi" },
];

type Props = {
    children: ReactNode;
    /** Opsional. Bila kosong, diambil dari shared prop `faculty`, lalu data cadangan. */
    faculty?: FacultyInfo;
    /** true untuk halaman dalam yang tidak punya hero, agar navbar langsung berlatar. */
    solidNav?: boolean;
};

export default function PublicLayout({
    children,
    faculty,
    solidNav = false,
}: Props) {
    const shared = usePage<{ faculty?: FacultyInfo }>().props.faculty;
    const info = faculty ?? shared;

    if (!info) {
        throw new Error("Data fakultas tidak ditemukan.");
    }
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Saat menu seluler terbuka, navbar tetap diberi latar agar menu terbaca
    const solid = solidNav || scrolled || menuOpen;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
            {/* ============ NAVBAR ============ */}
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
                    menuOpen
                        ? "bg-white shadow-lg shadow-indigo-950/10"
                        : solid
                          ? "border-b border-white/60 bg-white/80 shadow-sm shadow-indigo-900/5 backdrop-blur-xl"
                          : "border-b border-transparent bg-transparent"
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[68px] sm:px-6 lg:h-16 lg:px-8">
                    {/* LOGO */}
                    <a
                        href="/#beranda"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md sm:h-11 sm:w-11">
                            <img
                                src="/logo_unival.png"
                                alt="Logo Universitas Al-Khairiyah"
                                className="h-full w-full object-contain p-1"
                            />
                        </span>

                        <span className="leading-tight">
                            <span className="block text-sm font-bold text-indigo-950 sm:text-[15px]">
                                {info.name}
                            </span>

                            <span className="block text-[11px] text-slate-500 sm:text-xs">
                                {info.university}
                            </span>
                        </span>
                    </a>

                    {/* DESKTOP NAV */}
                    <nav
                        className="hidden items-center gap-1 lg:flex"
                        aria-label="Navigasi utama"
                    >
                        {NAV.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* HAMBURGER MOBILE + TABLET */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className={`relative z-[60] grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 lg:hidden ${
                            menuOpen
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-indigo-900 hover:bg-indigo-50"
                        }`}
                        aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                    >
                        <Menu
                            className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
                                menuOpen
                                    ? "rotate-90 scale-50 opacity-0"
                                    : "rotate-0 scale-100 opacity-100"
                            }`}
                        />

                        <X
                            className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
                                menuOpen
                                    ? "rotate-0 scale-100 opacity-100"
                                    : "-rotate-90 scale-50 opacity-0"
                            }`}
                        />
                    </button>
                </div>

                {/* MOBILE / TABLET MENU */}
                <div
                    id="mobile-menu"
                    aria-hidden={!menuOpen}
                    className={`absolute inset-x-0 top-full overflow-hidden bg-white shadow-xl shadow-indigo-950/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
                        menuOpen
                            ? "visible max-h-[calc(100vh-4rem)] translate-y-0 opacity-100"
                            : "invisible max-h-0 -translate-y-3 opacity-0"
                    }`}
                >
                    <nav
                        className="mx-auto w-full max-w-2xl px-5 py-5 sm:px-8 sm:py-6"
                        aria-label="Navigasi seluler"
                    >
                        <div className="space-y-1.5">
                            {NAV.map((item, i) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    style={{
                                        transitionDelay: menuOpen
                                            ? `${60 + i * 45}ms`
                                            : "0ms",
                                    }}
                                    className={`group flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-center text-[15px] font-semibold text-slate-700 transition-all duration-300 ease-out hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] sm:py-4 sm:text-base ${
                                        menuOpen
                                            ? "translate-y-0 opacity-100"
                                            : "-translate-y-4 opacity-0"
                                    }`}
                                >
                                    <span className="transition-transform duration-300 group-hover:scale-[1.02]">
                                        {item.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </nav>
                </div>
            </header>

            <main>{children}</main>

            {/* ============ FOOTER ============ */}
            <footer className="relative overflow-hidden bg-indigo-950 text-indigo-200">
                <Blob className="-left-24 -top-24 h-80 w-80 bg-gradient-to-br from-indigo-500/30 to-sky-400/10" />
                <Blob className="-right-24 bottom-0 h-80 w-80 bg-gradient-to-br from-teal-400/20 to-emerald-300/5" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
                    {/* IDENTITAS FAKULTAS */}
                    <div className="lg:col-span-2">
                        <a
                            href="/#beranda"
                            className="inline-flex items-center gap-3"
                        >
                            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md">
                                <img
                                    src="/logo_unival.png"
                                    alt={`Logo ${info.university}`}
                                    className="h-full w-full object-contain p-1"
                                />
                            </span>

                            <span className="leading-tight">
                                <span className="block text-sm font-bold text-white">
                                    {info.name}
                                </span>

                                <span className="block text-xs text-indigo-300">
                                    {info.university}
                                </span>
                            </span>
                        </a>

                        <p className="mt-5 max-w-md leading-relaxed text-indigo-200">
                            {info.description}
                        </p>
                    </div>

                    {/* TAUTAN */}
                    <div>
                        <h3 className="font-bold text-white">Tautan</h3>

                        <ul className="mt-4 space-y-2.5 text-sm">
                            {NAV.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="transition hover:text-white"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* KONTAK */}
                    <div>
                        <h3 className="font-bold text-white">Hubungi kami</h3>

                        <ul className="mt-4 space-y-3 text-sm">
                            <li className="flex gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                <span>{info.address}</span>
                            </li>

                            <li className="flex gap-3">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                <span>{info.email}</span>
                            </li>

                            <li className="flex gap-3">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                <span>{info.phone}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="relative border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-indigo-300 sm:flex-row sm:px-6 lg:px-8">
                        <p className="text-center text-sm leading-relaxed text-slate-500 lg:text-left">
                            © {new Date().getFullYear()} {info.name},{" "}
                            {info.university}. Semua hak dilindungi.
                        </p>

                        <p>
                            Developed by{" "}
                            <span className="font-semibold text-white">
                                Bayu Albar Ladici
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
