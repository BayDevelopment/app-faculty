// resources/js/components/app-logo.tsx

const FACULTY_NAME = "Fakultas Teknik";
const UNIVERSITY_NAME = "Universitas Al-Khairiyah";

export default function AppLogo() {
    return (
        <>
            {/* Logo */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0.5 dark:ring-white/10">
                <img
                    src="/logo_unival.png"
                    alt="Logo Universitas Al-Khairiyah"
                    className="size-full object-contain"
                    draggable={false}
                />
            </div>

            {/* Pemisah */}
            <span className="h-8 w-px shrink-0 bg-slate-200 group-data-[collapsible=icon]:hidden dark:bg-white/15" />

            {/* Nama fakultas & universitas */}
            <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-bold text-indigo-950 dark:text-white">
                    {FACULTY_NAME}
                </span>
                <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {UNIVERSITY_NAME}
                </span>
            </div>
        </>
    );
}
