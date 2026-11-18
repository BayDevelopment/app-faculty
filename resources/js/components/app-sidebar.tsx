// resources/js/components/app-sidebar.tsx
import { Link, usePage } from "@inertiajs/react";
import {
    BarChart3,
    BookOpen,
    Building2,
    FileText,
    FolderGit2,
    GraduationCap,
    Images,
    LayoutGrid,
    MessageSquareQuote,
    Users,
    Wrench,
} from "lucide-react";

import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { dashboard } from "@/routes";
import type { NavItem } from "@/types";

/* ------------------------------------------------------------------ */
/*  MENU                                                                */
/* ------------------------------------------------------------------ */

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const contentNavItems: NavItem[] = [
    { title: "Fakultas", href: "/fakultas", icon: Building2 },
    { title: "Foto Beranda", href: "/foto-beranda", icon: Images },
    { title: "Program Studi", href: "/prodi", icon: GraduationCap },
    { title: "Layanan", href: "/layanan", icon: Wrench },
    { title: "Berita", href: "/kelola-berita", icon: FileText },
    { title: "Testimonial", href: "/testimonial", icon: MessageSquareQuote },
    { title: "Statistik", href: "/statistik", icon: BarChart3 },
];

const managementNavItems: NavItem[] = [
    { title: "Pengguna", href: "/users", icon: Users },
];

/* ------------------------------------------------------------------ */
/*  HELPER                                                              */
/* ------------------------------------------------------------------ */

const hrefOf = (href: NavItem["href"]) =>
    typeof href === "string" ? href : href.url;

/** Aktif jika URL sekarang sama dengan menu, atau berada di bawahnya (/fakultas/1). */
const isActiveUrl = (current: string, href: string) => {
    const path = current.split("?")[0];

    return path === href || path.startsWith(`${href}/`);
};

/* ------------------------------------------------------------------ */
/*  STYLING (Tailwind v4: tanda ! di belakang = important)              */
/* ------------------------------------------------------------------ */

const navButton = cn(
    "group/nav relative h-10 gap-3 rounded-xl px-3 text-[13.5px] font-medium",
    "text-slate-600 transition-all duration-200 dark:text-slate-300",
    // hover: geser sedikit, latar indigo lembut
    "hover:translate-x-1 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm",
    "dark:hover:bg-white/10 dark:hover:text-white",
    // aktif: gradasi + glow
    "data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-700 data-[active=true]:to-indigo-500",
    "data-[active=true]:font-semibold data-[active=true]:text-white",
    "data-[active=true]:shadow-lg data-[active=true]:shadow-indigo-600/30",
    "data-[active=true]:hover:translate-x-0 data-[active=true]:hover:text-white",
    // sidebar menciut jadi ikon: jangan geser
    "group-data-[collapsible=icon]:hover:translate-x-0",
);

const groupLabel =
    "px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500";

/* ------------------------------------------------------------------ */
/*  KOMPONEN                                                            */
/* ------------------------------------------------------------------ */

function ActiveDot({ active }: { active: boolean }) {
    return (
        <span className="relative ml-auto flex size-2 shrink-0 overflow-visible! group-data-[collapsible=icon]:hidden">
            {active && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-300 opacity-70" />
            )}
            <span
                className={cn(
                    "relative inline-flex size-2 rounded-full transition-all duration-200",
                    active
                        ? "bg-teal-300 shadow-[0_0_10px_2px_rgba(94,234,212,0.85)]"
                        : "scale-0 bg-indigo-400 group-hover/nav:scale-100",
                )}
            />
        </span>
    );
}

function NavSection({ label, items }: { label?: string; items: NavItem[] }) {
    const { url } = usePage();

    return (
        <SidebarGroup className="px-2 py-1">
            {label && (
                <SidebarGroupLabel className={groupLabel}>
                    {label}
                </SidebarGroupLabel>
            )}

            <SidebarMenu>
                {items.map((item) => {
                    const active = isActiveUrl(url, hrefOf(item.href));

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={navButton}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon className="size-4 transition-transform duration-200 group-hover/nav:-rotate-6 group-hover/nav:scale-110" />
                                    )}
                                    <span>{item.title}</span>
                                    <ActiveDot active={active} />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Logo / Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="rounded-xl transition hover:bg-indigo-50 group-data-[collapsible=icon]:p-0! dark:hover:bg-white/10"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavSection items={mainNavItems} />
                <NavSection label="Konten Website" items={contentNavItems} />
                <NavSection label="Manajemen" items={managementNavItems} />
            </SidebarContent>

            {/* Footer bawaan */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
