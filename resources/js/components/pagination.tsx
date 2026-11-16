import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    current: number;
    last: number;
    total: number;
    from: number | null;
    to: number | null;
    /** Nama item untuk teks ringkasan, contoh: "program studi". */
    label: string;
    onChange: (page: number) => void;
    /** `light` untuk latar terang, `dark` untuk latar gelap (section layanan). */
    tone?: 'light' | 'dark';
};

function pageList(current: number, last: number): (number | '…')[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

    const pages = [...new Set([1, last, current - 1, current, current + 1])]
        .filter((p) => p >= 1 && p <= last)
        .sort((a, b) => a - b);

    const out: (number | '…')[] = [];
    pages.forEach((p, i) => {
        if (i > 0 && p - pages[i - 1] > 1) out.push('…');
        out.push(p);
    });
    return out;
}

/** Hanya tampil bila halaman lebih dari satu (data lebih dari batas per halaman). */
export default function Pagination({ current, last, total, from, to, label, onChange, tone = 'light' }: PaginationProps) {
    if (last <= 1) return null;

    const dark = tone === 'dark';

    const base = 'grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40';
    const idle = dark
        ? 'bg-white/10 text-indigo-100 hover:bg-white/20'
        : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700';
    const active = dark ? 'bg-white text-indigo-900' : 'bg-indigo-700 text-white shadow-md shadow-indigo-700/20';

    return (
        <nav aria-label={`Halaman ${label}`} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className={`text-sm ${dark ? 'text-indigo-200' : 'text-slate-500'}`}>
                Menampilkan {from}–{to} dari {total} {label}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button type="button" aria-label="Halaman sebelumnya" disabled={current <= 1} onClick={() => onChange(current - 1)} className={`${base} ${idle}`}>
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {pageList(current, last).map((p, i) =>
                    p === '…' ? (
                        <span key={`gap-${i}`} className={`px-1 text-sm ${dark ? 'text-indigo-300' : 'text-slate-400'}`}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            aria-label={`Halaman ${p}`}
                            aria-current={p === current ? 'page' : undefined}
                            onClick={() => onChange(p)}
                            className={`${base} ${p === current ? active : idle}`}
                        >
                            {p}
                        </button>
                    ),
                )}

                <button type="button" aria-label="Halaman berikutnya" disabled={current >= last} onClick={() => onChange(current + 1)} className={`${base} ${idle}`}>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </nav>
    );
}