import {
  BarChart3,
  LayoutDashboard,
  MapPinned,
  Newspaper,
  Settings,
  ShieldCheck,
  Store,
  Users,
  Activity,
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
      {
        label: "Data UMKM",
        href: "/admin/umkm",
        icon: Store,
      },
      {
        label: "Monitoring UMKM",
        href: "/admin/monitoring",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Verifikasi UMKM",
    href: "/admin/verifikasi",
    icon: ShieldCheck,
    roles: ["super_admin", "admin_kecamatan", "admin"],
    badgeKey: "verifikasi",
  },
  {
    label: "Admin Kecamatan",
    href: "/admin/admin-kecamatan",
    icon: Users,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Berita",
    href: "/admin/berita",
    icon: Newspaper,
    roles: ["super_admin", "admin_kecamatan", "admin"],
  },
  {
    label: "Peta",
    href: "/admin/peta",
    icon: MapPinned,
    roles: ["super_admin", "admin_kecamatan", "admin"],
  },
  {
    label: "Pengaturan Badge",
    href: "/admin/pengaturan-badge",
    icon: Settings,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Log Aktivitas",
    href: "/admin/log-aktivitas",
    icon: Activity,
    roles: ["super_admin", "admin"],
  },
];
