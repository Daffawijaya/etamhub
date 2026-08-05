import {
  LayoutDashboard,
  Store,
  MapPinned,
  Plus,
  UsersRound,
  ClipboardList,
} from "lucide-react";

export interface SidebarMenu {
  label: string;
  href: string;
  icon: any;
  roles?: string[];
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
    label: "Requests",
    href: "/admin/requests",
    icon: ClipboardList,
  },
  // {
  //   label: "Tambah UMKM",
  //   href: "/admin/tambah",
  //   icon: Plus,
  // },
  // {
  //   label: "Kelola Akun",
  //   href: "/admin/akun",
  //   icon: UsersRound,
  //   roles: ["super_admin"],
  // },
  {
    label: "Peta",
    href: "/admin/peta",
    icon: MapPinned,
  },
];
