"use client";

import { useCallback, useEffect, useState } from "react";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarToggle from "./SidebarToggle";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";
import { menus } from "./sidebar-data";
import { Settings } from "lucide-react";

const STORAGE_KEY = "admin-sidebar-collapsed";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchBadges = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/badges", { cache: "no-store" });
      if (res.ok) {
        setBadges(await res.json());
      }
    } catch {}
  }, []);

  const fetchNotifCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications/count", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setNotifCount(data.count ?? 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role);
      });
  }, []);

  // Poll badges + notifications every 10 seconds
  useEffect(() => {
    if (!role) return;

    fetchBadges();
    fetchNotifCount();
    const interval = setInterval(() => {
      fetchBadges();
      fetchNotifCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [role, fetchBadges, fetchNotifCount]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      setCollapsed(saved === "true");
    } else if (window.innerWidth < 1024) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, []);

  useEffect(() => {
    if (collapsed === null) return;
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleToggle() {
    setHasInteracted(true);
    setCollapsed((prev) => !(prev ?? false));
  }

  // Don't render until we know the collapsed state
  if (collapsed === null) return null;

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
        ${hasInteracted ? "transition-[width] duration-500 ease-[cubic-bezier(.22,1,.36,1)]" : ""}
        ${collapsed ? "w-16" : "w-70"}
      `}
    >
      {/* Logo */}
      <SidebarLogo collapsed={collapsed} />

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <div className="space-y-1">
          {menus
            .filter((menu) => {
              if (!menu.roles) return true;
              return menu.roles.includes(role ?? "");
            })
            .map((menu) => (
              <SidebarItem
                key={menu.label}
                menu={menu}
                collapsed={collapsed}
                badges={{
                  ...badges,
                  ...(notifCount > 0 ? { notifikasi: notifCount } : {}),
                }}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
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

      {/* Floating Toggle — rendered after nav so it sits on top */}
      <SidebarToggle
        collapsed={collapsed}
        onToggle={handleToggle}
      />

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </aside>
  );
}
