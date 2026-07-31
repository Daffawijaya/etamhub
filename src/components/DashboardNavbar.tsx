"use client";

import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import AdminNotification from "./admin/AdminNotification";
import ThemeToggle from "./ThemeToggle";

interface DashboardNavbarProps {
  title?: string;
  role?: "admin" | "user";
}

export default function DashboardNavbar({
  title = "Dashboard",
  role = "admin",
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const isMapPage = role === "admin" && pathname === "/admin/peta";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/";
  };

  const Notification = () => {
    if (role === "admin") {
      return <AdminNotification />;
    }

    return null;
  };

  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="
        flex h-12 items-center gap-2 rounded-2xl 
        bg-red-500 dark:bg-danger px-4 text-sm font-medium text-white
        transition-all duration-300
        hover:bg-red-600 dark:hover:bg-danger-hover
      "
    >
      <LogOut size={18} />
      Keluar
    </button>
  );

  const ThemeButton = () => (
    <div
      className="
        flex h-12 w-12 items-center justify-center rounded-2xl
        bg-white dark:bg-dark-card
        text-slate-900 dark:text-white
        transition-all duration-300
        hover:bg-slate-50 dark:hover:bg-neutral-800
      "
    >
      <ThemeToggle />
    </div>
  );

  if (isMapPage) {
    return (
      <header className="absolute top-4 right-6 z-[1000]">
        <div className="flex items-center gap-4">
          <ThemeButton />
          <Notification />
          <LogoutButton />
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4 bg-light dark:bg-dark">
      <div>
        <h1
          className="
            text-4xl font-bold 
            text-slate-900 dark:text-white
            transition-colors duration-300
          "
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeButton />
        <Notification />
        <LogoutButton />
      </div>
    </header>
  );
}
