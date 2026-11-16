import { usePage } from "@inertiajs/react";
import { GraduationCap, Mail, MapPin, Menu, Phone, X } from "lucide-react";
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

const FALLBACK: FacultyInfo = {
    name: "Fakultas Teknik",
    university: "Universitas Al-Khairiyah",
    description:
        "Fakultas Teknik Universitas Al-Khairiyah menyelenggarakan program studi Teknik Industri dan Teknik Kimia dengan praktikum laboratorium dan kerja sama industri.",
    // TODO: ganti dengan alamat resmi kampus
    address: "Cilegon, Banten",
    email: "teknik@alkhairiyah.ac.id",
    phone: "(0254) 123 456",
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
    const info = faculty ?? shared ?? FALLBACK;

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
                className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
                    menuOpen
                        ? "border-slate-200 bg-white shadow-sm shadow-indigo-900/5"
                        : solid
                          ? "border-white/60 bg-white/75 shadow-sm shadow-indigo-900/5 backdrop-blur-lg"
                          : "border-transparent bg-transparent"
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a href="/#beranda" className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white shadow-md">
                            <GraduationCap className="h-5 w-5" />
                        </span>
                        <span className="leading-tight">
                            <span className="block text-sm font-bold text-indigo-950">
                                {info.name}
                            </span>
                            <span className="block text-xs text-slate-500">
                                {info.university}
                            </span>
                        </span>
                    </a>

                    <nav
                        className="hidden items-center gap-1 lg:flex"
                        aria-label="Navigasi utama"
                    >
                        {NAV.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Hamburger: ikon berputar dan saling menggantikan */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="relative grid h-10 w-10 place-items-center rounded-lg text-indigo-900 transition hover:bg-indigo-50 lg:hidden"
                        aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                    >
                        <Menu
                            className={`absolute h-5 w-5 transition-all duration-300 motion-reduce:transition-none ${
                                menuOpen
                                    ? "rotate-90 scale-50 opacity-0"
                                    : "rotate-0 scale-100 opacity-100"
                            }`}
                        />
                        <X
                            className={`absolute h-5 w-5 transition-all duration-300 motion-reduce:transition-none ${
                                menuOpen
                                    ? "rotate-0 scale-100 opacity-100"
                                    : "-rotate-90 scale-50 opacity-0"
                            }`}
                        />
                    </button>
                </div>

                {/* Menu seluler: selalu dirender agar bisa dianimasikan masuk dan keluar */}
                <div
                    id="mobile-menu"
                    aria-hidden={!menuOpen}
                    className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
                        menuOpen
                            ? "visible grid-rows-[1fr] opacity-100"
                            : "invisible grid-rows-[0fr] opacity-0"
                    }`}
                >
                    <div className="overflow-hidden">
                        <nav
                            className="border-t border-slate-200 px-4 py-3"
                            aria-label="Navigasi seluler"
                        >
                            {NAV.map((item, i) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    style={{
                                        transitionDelay: menuOpen
                                            ? `${80 + i * 45}ms`
                                            : "0ms",
                                    }}
                                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-700 motion-reduce:transition-none ${
                                        menuOpen
                                            ? "translate-y-0 opacity-100"
                                            : "-translate-y-2 opacity-0"
                                    }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            {/* ============ FOOTER ============ */}
            <footer className="relative overflow-hidden bg-indigo-950 text-indigo-200">
                <Blob className="-left-24 -top-24 h-80 w-80 bg-gradient-to-br from-indigo-500/30 to-sky-400/10" />
                <Blob className="-right-24 bottom-0 h-80 w-80 bg-gradient-to-br from-teal-400/20 to-emerald-300/5" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 text-white">
                                <GraduationCap className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="font-bold text-white">
                                    {info.name}
                                </p>
                                <p className="text-sm">{info.university}</p>
                            </div>
                        </div>
                        <p className="mt-5 max-w-md leading-relaxed">
                            {info.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white">Tautan</h3>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {NAV.map((n) => (
                                <li key={n.href}>
                                    <a
                                        href={n.href}
                                        className="transition hover:text-white"
                                    >
                                        {n.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white">Hubungi kami</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li className="flex gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                {info.address}
                            </li>
                            <li className="flex gap-3">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                {info.email}
                            </li>
                            <li className="flex gap-3">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                {info.phone}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="relative border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-indigo-300 sm:flex-row sm:px-6 lg:px-8">
                        <p>
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
