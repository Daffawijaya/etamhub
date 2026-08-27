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
  },
  {
    label: "Verifikasi UMKM",
    href: "/admin/verifikasi",
    icon: ShieldCheck,
    roles: ["super_admin", "admin_kecamatan"],
    badgeKey: "verifikasi",
  },
  {
    label: "Monitoring UMKM",
    href: "/admin/monitoring",
    icon: BarChart3,
    roles: ["super_admin", "admin_kecamatan"],
  },
  {
    label: "Admin Kecamatan",
    href: "/admin/admin-kecamatan",
    icon: Users,
    roles: ["super_admin"],
  },
  {
    label: "Requests",
    href: "/admin/requests",
    icon: ClipboardList,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Berita",
    href: "/admin/berita",
    icon: Newspaper,
  },
  {
    label: "Peta",
    href: "/admin/peta",
    icon: MapPinned,
  },
  {
    label: "Pengaturan Badge",
    href: "/admin/pengaturan-badge",
    icon: Settings,
    roles: ["super_admin"],
  },
];
