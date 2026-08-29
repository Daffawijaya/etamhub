"use client";

import { useCallback, useEffect, useState } from "react";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarToggle from "./SidebarToggle";
import { menus } from "./sidebar-data";

const STORAGE_KEY = "admin-sidebar-collapsed";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(0);

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
      <div className="relative">
        <SidebarLogo collapsed={collapsed} />
        {notifCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">
            {notifCount > 99 ? "99+" : notifCount}
          </span>
        )}
      </div>

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
                badges={badges}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            ))}
        </div>
      </nav>

      {/* Floating Toggle — rendered after nav so it sits on top */}
      <SidebarToggle
        collapsed={collapsed}
        onToggle={handleToggle}
      />
    </aside>
  );
}
