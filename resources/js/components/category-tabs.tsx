import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type CategoryTabsProps = {
    items: string[];
    active: string;
    onSelect: (category: string) => void;
};

export default function CategoryTabs({
    items,
    active,
    onSelect,
}: CategoryTabsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const updateArrows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        setCanLeft(el.scrollLeft > 4);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateArrows();

        const el = scrollRef.current;
        el?.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);

        return () => {
            el?.removeEventListener("scroll", updateArrows);
            window.removeEventListener("resize", updateArrows);
        };
    }, [items, updateArrows]);

    // Auto-scroll kategori aktif ke tengah
    useEffect(() => {
        const el = scrollRef.current;
        const target = el?.querySelector<HTMLElement>('[data-active="true"]');
        if (!el || !target) return;

        el.scrollTo({
            left:
                target.offsetLeft - el.clientWidth / 2 + target.clientWidth / 2,
            behavior: "smooth",
        });
    }, [active]);

    const scrollBy = (amount: number) =>
        scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });

    const all = ["Semua", ...items];

    return (
        <div className="relative min-w-0 flex-1">
            {/* Fade + panah kiri */}
            {canLeft && (
                <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-gradient-to-r from-white via-white/90 to-transparent pr-6">
                    <button
                        type="button"
                        onClick={() => scrollBy(-240)}
                        aria-label="Geser kiri"
                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Daftar kategori */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scroll-smooth py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {all.map((item) => {
                    const isActive = active === item;

                    return (
                        <button
                            key={item}
                            type="button"
                            data-active={isActive}
                            aria-pressed={isActive}
                            onClick={() => onSelect(item)}
                            className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                isActive
                                    ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20"
                                    : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            {/* Fade + panah kanan */}
            {canRight && (
                <div className="absolute right-0 top-0 z-10 flex h-full items-center bg-gradient-to-l from-white via-white/90 to-transparent pl-6">
                    <button
                        type="button"
                        onClick={() => scrollBy(240)}
                        aria-label="Geser kanan"
                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
