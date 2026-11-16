import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type RevealProps = {
    children: ReactNode;
    /** Jeda dalam milidetik, dipakai untuk membuat efek bergiliran antar elemen. */
    delay?: number;
    /** Tag HTML pembungkus, default `div`. */
    as?: ElementType;
    className?: string;
};

/**
 * Memunculkan elemen dengan fade-in + naik sedikit saat masuk layar.
 * Hanya berjalan sekali, dan dilewati bila pengguna mengaktifkan "kurangi gerakan".
 *
 * Tips: beri `delay` pada pembungkusnya, bukan pada card yang punya efek hover,
 * supaya hover tidak ikut tertunda.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: RevealProps) {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !('IntersectionObserver' in window)) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition duration-700 ease-out ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            } ${className}`}
        >
            {children}
        </Tag>
    );
}