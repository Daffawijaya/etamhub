"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import UserSidebar from "@/components/user/sidebar/UserSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

// Pages accessible without UMKM data
const ALLOWED_WITHOUT_UMKM = ["/user/tambah", "/user/profil"];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip check for allowed pages
    if (ALLOWED_WITHOUT_UMKM.some((p) => pathname.startsWith(p))) {
      setChecking(false);
      return;
    }

    async function checkUmkm() {
      try {
        const res = await fetch("/api/user/umkm", { cache: "no-store" });
        const data = await res.json();

        // API returns null when no UMKM and no pending request
        // API returns { isPendingRequest: true } when waiting for approval
        // API returns { id: "..." } when UMKM exists
        const hasUmkm = data && (data.id != null || data.isPendingRequest || data.approval_status);

        if (hasUmkm) {
          setChecking(false);
        } else {
          // No UMKM — force redirect to tambah
          router.replace("/user/tambah");
        }
      } catch {
        setChecking(false);
      }
    }

    checkUmkm();
  }, [pathname, router]);

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

  if (checking && !ALLOWED_WITHOUT_UMKM.some((p) => pathname.startsWith(p))) {
    return (
      <main className="min-h-screen bg-light-bg">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="mt-3 text-sm text-slate-500">Memuat...</p>
          </div>
        </div>
      </main>
    );
  }

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
