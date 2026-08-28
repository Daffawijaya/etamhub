import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  Newspaper,
  Settings,
  ShieldCheck,
  Store,
  Users,
  Activity,
} from "lucide-react";

export interface SidebarMenu {
  label: string;
  href: string;
  icon: any;
  roles?: string[];
  badgeKey?: string;
}

export const menus: SidebarMenu[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "UMKM",
    href: "/admin/umkm",
    icon: Store,
    roles: ["super_admin", "admin_kecamatan", "admin"],
  },
  {
    label: "Verifikasi UMKM",
    href: "/admin/verifikasi",
    icon: ShieldCheck,
    roles: ["super_admin", "admin_kecamatan", "admin"],
    badgeKey: "verifikasi",
  },
  {
    label: "Monitoring UMKM",
    href: "/admin/monitoring",
    icon: BarChart3,
    roles: ["super_admin", "admin_kecamatan", "admin"],
  },
  {
    label: "Admin Kecamatan",
    href: "/admin/admin-kecamatan",
    icon: Users,
    roles: ["super_admin", "admin"],
  },
  // Requests dihapus — tidak diperlukan lagi
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
