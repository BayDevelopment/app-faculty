/** Gradient blob dekoratif. Letakkan di dalam parent `relative overflow-hidden`. */
export default function Blob({ className = '' }: { className?: string }) {
    return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}