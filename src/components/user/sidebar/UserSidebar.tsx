"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Settings, LogOut } from "lucide-react";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarToggle from "./SidebarToggle";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";
import ThemeToggle from "@/components/ThemeToggle";
import { userMenus } from "./user-sidebar-data";

const STORAGE_KEY = "user-sidebar-collapsed";

interface UserSidebarProps {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function UserSidebar({ mobile = false, open = false, onClose }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
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

  // Desktop: auto-collapse on resize
  useEffect(() => {
    if (mobile) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobile]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (!mounted && !mobile) return null;

  // --- Mobile sidebar: fullscreen slide-down overlay (like MobileNavbar) ---
  if (mobile) {
    return (
      <>
        {/* Hamburger trigger bar — fixed top bar on mobile */}
        <nav
          className={`
            fixed top-0 left-0 z-50
            w-screen h-12
            flex items-center justify-between px-5
            bg-light dark:bg-dark/40 backdrop-blur-xl
            border-b border-white dark:border-white/10
            lg:hidden
          `}
        >
          <Link href="/user" className="text-xl font-bold tracking-wide text-black dark:text-white">
            etamhub.
          </Link>

          <button
            onClick={() => onClose?.()}
            className="text-black dark:text-white text-xl"
          >
            <FiMenu />
          </button>
        </nav>

        {/* Fullscreen overlay menu */}
        <div
          className={`
            fixed inset-0 z-[60]
            bg-light dark:bg-dark
            transition-transform duration-300 ease-out
            ${open ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white dark:border-white/10">
            <Link
              href="/user"
              onClick={() => onClose?.()}
              className="text-xl font-bold tracking-wide text-black dark:text-white"
            >
              etamhub.
            </Link>

            <button
              onClick={() => onClose?.()}
              className="text-black dark:text-white text-3xl"
            >
              <FiX />
            </button>
          </div>

          {/* Menu items */}
          <div className="flex flex-col px-6 pt-10 gap-8">
            {userMenus.map((menu) => {
              const Icon = menu.icon;
              const isActive = pathname === menu.href;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => onClose?.()}
                  className={`flex items-center gap-3 text-xl font-medium transition-colors ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Icon size={22} />
                  {menu.label}
                </Link>
              );
            })}
          </div>

          {/* Bottom buttons */}
          <div className="absolute bottom-6 left-0 w-full px-6 space-y-3">
            <button
              onClick={() => {
                onClose?.();
                setShowPasswordModal(true);
              }}
              className="
                w-full h-11 rounded-lg
                flex items-center justify-center gap-2
                border border-slate-200 dark:border-white/10
                bg-transparent
                text-sm font-medium
                text-black dark:text-white
                hover:bg-slate-100 dark:hover:bg-white/5
                transition-colors
              "
            >
              <Settings size={16} />
              Pengaturan Akun
            </button>

            <button
              onClick={() => {
                onClose?.();
                handleLogout();
              }}
              className="
                w-full h-11 rounded-lg
                flex items-center justify-center gap-2
                bg-red-500 dark:bg-danger
                text-sm font-medium text-white
                hover:bg-red-600 dark:hover:bg-danger-hover
                transition-colors
              "
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>

        <ChangePasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </>
    );
  }

  // --- Desktop sidebar: sticky, collapsible ---
  return (
    <aside
      className={`
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

      {/* Theme toggle — only when expanded */}
      {!collapsed && (
        <div className="px-4 pb-2">
          <ThemeToggle />
        </div>
      )}

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
                  ? "w-0 -translate-x-3 opacity-0"
                  : "w-auto translate-x-0 opacity-100"
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
