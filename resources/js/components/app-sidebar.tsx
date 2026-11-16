import { Link } from "@inertiajs/react";
import {
    BarChart3,
    BookOpen,
    Building2,
    FileText,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    MessageSquareQuote,
    Users,
    Wrench,
} from "lucide-react";

import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { dashboard } from "@/routes";
import type { NavItem } from "@/types";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const contentNavItems: NavItem[] = [
    {
        title: "Fakultas",
        href: "/admin/fakultas",
        icon: Building2,
    },
    {
        title: "Program Studi",
        href: "/admin/program-studi",
        icon: GraduationCap,
    },
    {
        title: "Layanan",
        href: "/admin/layanan",
        icon: Wrench,
    },
    {
        title: "Berita",
        href: "/admin/berita",
        icon: FileText,
    },
    {
        title: "Testimonial",
        href: "/admin/testimonial",
        icon: MessageSquareQuote,
    },
    {
        title: "Statistik",
        href: "/admin/statistik",
        icon: BarChart3,
    },
];

const managementNavItems: NavItem[] = [
    {
        title: "Pengguna",
        href: "/admin/users",
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: "Repository",
        href: "https://github.com/laravel/react-starter-kit",
        icon: FolderGit2,
    },
    {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#react",
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Logo / Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Dashboard */}
                <NavMain items={mainNavItems} />

                {/* Konten Website */}
                <div className="px-2 py-2">
                    <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground">
                        KONTEN WEBSITE
                    </p>

                    <NavMain items={contentNavItems} />
                </div>

                {/* Manajemen */}
                <div className="px-2 py-2">
                    <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground">
                        MANAJEMEN
                    </p>

                    <NavMain items={managementNavItems} />
                </div>
            </SidebarContent>

            {/* Footer bawaan */}
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
