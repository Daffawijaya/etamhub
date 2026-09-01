"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import UserSidebar from "@/components/user/sidebar/UserSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

// Pages accessible without UMKM data
const ALLOWED_WITHOUT_UMKM = ["/user/tambah"];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (ALLOWED_WITHOUT_UMKM.some((p) => pathname.startsWith(p))) {
      setChecking(false);
      return;
    }

    async function checkUmkm() {
      try {
        const res = await fetch("/api/user/umkm", { cache: "no-store" });
        const data = await res.json();
        const hasUmkm = data && (data.id != null || data.isPendingRequest || data.approval_status);

        if (hasUmkm) {
          setChecking(false);
        } else {
          router.replace("/user/tambah");
        }
      } catch {
        setChecking(false);
      }
    }

    checkUmkm();
  }, [pathname, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getTitle = () => {
    if (pathname === "/user") return "Dashboard";
    if (pathname === "/user/umkm") return "UMKM Saya";
    if (pathname === "/user/tambah") return "Tambah UMKM";
    if (pathname.match(/^\/user\/umkm\/[^/]+\/edit$/)) return "Edit UMKM";
    if (pathname.match(/^\/user\/umkm\/[^/]+$/)) return "Detail UMKM";
    if (pathname === "/user/profil") return "Profil";
    return "User";
  };

  if (checking && !ALLOWED_WITHOUT_UMKM.some((p) => pathname.startsWith(p))) {
    return (
      <main className="min-h-screen bg-light dark:bg-dark">
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
    <main className="flex min-h-screen flex-col bg-light dark:bg-dark">
      {/* Desktop layout */}
      <div className="hidden min-h-0 flex-1 lg:flex">
        <UserSidebar />

        <div className="flex-1 min-w-0 bg-light dark:bg-dark">
          <DashboardNavbar title={getTitle()} />
          <div className="px-6 pb-8">{children}</div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="min-h-0 flex-1 lg:hidden">
        <UserSidebar
          mobile
          open={sidebarOpen}
          onClose={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Content — pt-16 for navbar h-12 clearance, px-5 matches navbar px-5 */}
        <div className="pt-16 pb-8 px-5 bg-light dark:bg-dark">
          {children}
        </div>
      </div>
    </main>
  );
}
