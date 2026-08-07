import {
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  Newspaper,
  Store,
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
