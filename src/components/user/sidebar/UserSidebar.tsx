"use client";

import { useEffect, useState } from "react";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarToggle from "./SidebarToggle";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";
import { userMenus } from "./user-sidebar-data";
import { Settings } from "lucide-react"

const STORAGE_KEY = "user-sidebar-collapsed";

export default function UserSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      setCollapsed(saved === "true");
    } else if (window.innerWidth < 1024) {
      setCollapsed(true);
    }

    setMounted(true);

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUserName(data.nama ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed, mounted]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <aside
      className={`
        relative
        sticky
        top-0
        flex
        h-screen
        flex-col
        bg-white
        dark:bg-dark-card
        transition-[width]
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]
        ${collapsed ? "w-16" : "w-70"}
      `}
    >
      <SidebarToggle
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <SidebarLogo collapsed={collapsed} userName={userName} />

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <div className="space-y-1">
          {userMenus.map((menu) => (
            <SidebarItem key={menu.href} menu={menu} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* Pengaturan Akun */}
      <div className="px-2 pb-2">
        <button
          onClick={() => setShowPasswordModal(true)}
          title={collapsed ? "Pengaturan Akun" : ""}
          className={`
            group
            relative
            flex
            h-12
            w-full
            items-center
            overflow-hidden
            rounded-2xl

            transition-all
            duration-500
            ease-[cubic-bezier(.22,1,.36,1)]

            ${collapsed ? "justify-center px-0" : "justify-start gap-4 px-4"}

            text-slate-600
            dark:text-neutral-300

            hover:bg-slate-100
            hover:text-slate-900

            dark:hover:bg-neutral-800
            dark:hover:text-white
          `}
        >
          <div className="relative z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 text-slate-500 dark:text-neutral-400">
            <Settings size={20} strokeWidth={2.2} />
          </div>
          <span
            className={`
              relative z-10
              whitespace-nowrap text-left font-medium

              transition-all
              duration-500
              ease-[cubic-bezier(.22,1,.36,1)]

              ${
                collapsed
                  ? `w-0 -translate-x-3 opacity-0`
                  : `w-auto translate-x-0 opacity-100`
              }
            `}
          >
            Pengaturan Akun
          </span>
        </button>
      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </aside>
  );
}
