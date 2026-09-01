"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Settings, LogOut, ChevronDown } from "lucide-react";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarToggle from "./SidebarToggle";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";
import ThemeToggle from "@/components/ThemeToggle";
import { menus } from "./sidebar-data";

const STORAGE_KEY = "admin-sidebar-collapsed";

interface AdminSidebarProps {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ mobile = false, open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mounted, setMounted] = useState(false);

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
        setUserName(data.nama ?? null);
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

    setMounted(true);
  }, []);

  useEffect(() => {
    if (collapsed === null) return;
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

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

  function handleToggle() {
    setHasInteracted(true);
    setCollapsed((prev) => !(prev ?? false));
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const filteredMenus = menus.filter((menu) => {
    if (!menu.roles) return true;
    return menu.roles.includes(role ?? "");
  });

  if (!mounted && !mobile) return null;

  // --- Mobile sidebar: fullscreen slide-down overlay (like UserSidebar) ---
  if (mobile) {
    return (
      <>
        {/* Hamburger trigger bar — fixed top bar on mobile */}
        <nav
          className={`
            fixed top-0 left-0 z-[999]
            w-screen h-12
            flex items-center justify-between px-5
            bg-light dark:bg-dark/40 backdrop-blur-xl
            border-b border-white dark:border-white/10
            lg:hidden
          `}
        >
          <Link href="/admin" className="text-xl font-bold tracking-wide text-black dark:text-white">
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
            fixed inset-0 z-[1000]
            bg-light dark:bg-dark
            transition-transform duration-300 ease-out
            ${open ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white dark:border-white/10">
            <Link
              href="/admin"
              onClick={() => onClose?.()}
              className="text-xl font-bold tracking-wide text-black dark:text-white"
            >
              etamhub.
            </Link>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={() => onClose?.()}
                className="text-black dark:text-white text-3xl"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Menu items */}
          <div className="flex flex-col px-6 pt-10 gap-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {filteredMenus.map((menu) => {
              const Icon = menu.icon;
              const isActive = menu.href
                ? menu.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(menu.href)
                : menu.children?.some((c) => pathname.startsWith(c.href));

              const hasChildren = menu.children && menu.children.length > 0;
              const isMenuOpen = openMenu === menu.label;

              if (hasChildren) {
                const totalBadge = menu.children!.reduce(
                  (sum, c) => sum + (badges?.[c.badgeKey ?? ""] ?? 0),
                  0
                );
                const hasBadge = totalBadge > 0;

                return (
                  <div key={menu.label}>
                    {/* Parent button — accordion toggle */}
                    <button
                      onClick={() => setOpenMenu(isMenuOpen ? null : menu.label)}
                      className={`
                        w-full flex items-center gap-3 py-3 px-1
                        text-sm font-medium rounded-lg transition-colors
                        ${isActive
                          ? "text-black dark:text-white"
                          : "text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white"
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left">{menu.label}</span>
                      {hasBadge && (
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-300 ${
                          isMenuOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    {/* Children — slide-down accordion */}
                    <div
                      className={`
                        overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]
                        ${isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      <div className="pl-6 pt-1 pb-1 space-y-0.5">
                        {menu.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = pathname.startsWith(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => onClose?.()}
                              className={`
                                flex items-center gap-3 py-2.5 px-3 rounded-lg
                                text-[13px] font-medium transition-colors
                                ${childActive
                                  ? "bg-slate-100 text-slate-900 dark:bg-neutral-800 dark:text-white"
                                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                                }
                              `}
                            >
                              <ChildIcon size={16} />
                              <span>{child.label}</span>
                              {child.badgeKey && badges && (badges[child.badgeKey] ?? 0) > 0 && (
                                <span className="ml-1 h-2 w-2 rounded-full bg-red-500" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={menu.href}
                  href={menu.href!}
                  onClick={() => onClose?.()}
                  className={`flex items-center gap-3 py-3 px-1 text-base font-medium transition-colors ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Icon size={20} />
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

  // Don't render until we know the collapsed state
  if (collapsed === null) return null;

  // --- Desktop sidebar: sticky, collapsible ---
  return (
    <aside
      className={`
        relative
        overflow-visible
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
      <SidebarLogo collapsed={collapsed} userName={userName} />

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <div className="space-y-1">
          {filteredMenus.map((menu) => (
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

      {/* Toggle — same padding as menu items */}
      <div className="px-2 pb-2">
        <SidebarToggle
          collapsed={collapsed}
          onToggle={handleToggle}
        />
      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </aside>
  );
}
