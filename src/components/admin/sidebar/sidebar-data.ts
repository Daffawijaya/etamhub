import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  Newspaper,
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
    label: "Verifikasi UMKM",
    href: "/admin/verifikasi",
    icon: ShieldCheck,
    roles: ["super_admin", "admin_kecamatan"],
    badgeKey: "verifikasi",
  },
  {
    label: "UMKM",
    href: "/admin/umkm",
    icon: Store,
  },
  {
    label: "Requests",
    href: "/admin/requests",
    icon: ClipboardList,
    roles: ["super_admin", "admin"],
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
    label: "Berita",
    href: "/admin/berita",
    icon: Newspaper,
  },
  {
    label: "Peta",
    href: "/admin/peta",
    icon: MapPinned,
  },
];
