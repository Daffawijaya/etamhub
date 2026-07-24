"use client";

import { useEffect, useState } from "react";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarToggle from "./SidebarToggle";
import { menus } from "./sidebar-data";

const STORAGE_KEY = "admin-sidebar-collapsed";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      setCollapsed(saved === "true");
    } else if (window.innerWidth < 1024) {
      setCollapsed(true);
    }

    setMounted(true);
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
        z-1002
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
      {/* Floating Toggle */}
      <SidebarToggle
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      {/* Logo */}
      <SidebarLogo collapsed={collapsed} />

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <div className="space-y-1">
          {menus.map((menu) => (
            <SidebarItem key={menu.href} menu={menu} collapsed={collapsed} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
