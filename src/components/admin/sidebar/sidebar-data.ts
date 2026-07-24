import { LayoutDashboard, Store, MapPinned, Plus } from "lucide-react";

export interface SidebarMenu {
  label: string;
  href: string;
  icon: any;
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
    label: "Tambah UMKM",
    href: "/admin/tambah",
    icon: Plus,
  },
  {
    label: "Peta",
    href: "/admin/peta",
    icon: MapPinned,
  },
];
