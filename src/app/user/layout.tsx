"use client";

import { usePathname } from "next/navigation";

import UserSidebar from "@/components/user/sidebar/UserSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/user") {
      return "Dashboard";
    }

    if (pathname === "/user/umkm") {
      return "UMKM Saya";
    }

    if (pathname === "/user/tambah") {
      return "Tambah UMKM";
    }

    if (pathname.match(/^\/user\/umkm\/[^/]+\/edit$/)) {
      return "Edit UMKM";
    }

    if (pathname.match(/^\/user\/umkm\/[^/]+$/)) {
      return "Detail UMKM";
    }

    if (pathname === "/user/profil") {
      return "Profil";
    }

    return "User";
  };

  return (
    <main className="min-h-screen bg-light-bg">
      <div className="flex">
        <UserSidebar />

        <div className="flex-1 bg-light dark:bg-dark">
          <DashboardNavbar title={getTitle()} />

          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}
