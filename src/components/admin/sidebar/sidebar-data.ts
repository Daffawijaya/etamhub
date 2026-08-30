import {
  BarChart3,
  LayoutDashboard,
  Newspaper,
  Award,
  ShieldCheck,
  Store,
  Users,
  Activity,
  ClipboardList,
  UserCog,
  ListChecks,
} from "lucide-react";

export interface SidebarMenuItem {
  label: string;
  href: string;
  icon: any;
  badgeKey?: string;
}

export interface SidebarMenu {
  label: string;
  href?: string;
  icon: any;
  roles?: string[];
  badgeKey?: string;
  children?: SidebarMenuItem[];
}

export const menus: SidebarMenu[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "UMKM",
    icon: Store,
    roles: ["super_admin", "admin_kecamatan", "admin"],
    children: [
      { label: "Data UMKM", href: "/admin/umkm", icon: ClipboardList },
      { label: "Monitoring UMKM", href: "/admin/monitoring", icon: BarChart3 },
      { label: "Verifikasi UMKM", href: "/admin/verifikasi", icon: ListChecks, badgeKey: "verifikasi" },
    ],
  },
  {
    label: "Berita",
    href: "/admin/berita",
    icon: Newspaper,
    roles: ["super_admin", "admin_kecamatan", "admin"],
  },
  {
    label: "Akun",
    icon: Users,
    roles: ["super_admin", "admin"],
    children: [
      { label: "Kelola Akun", href: "/admin/admin-kecamatan", icon: UserCog },
      { label: "Log Aktivitas", href: "/admin/log-aktivitas", icon: Activity },
    ],
  },
  {
    label: "Pengaturan Badge",
    href: "/admin/pengaturan-badge",
    icon: Award,
    roles: ["super_admin", "admin"],
  },
];
