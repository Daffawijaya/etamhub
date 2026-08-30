"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { SidebarMenu } from "./sidebar-data";

interface SidebarItemProps {
  menu: SidebarMenu;
  collapsed: boolean;
  badges?: Record<string, number>;
  openMenu: string | null;
  setOpenMenu: (label: string | null) => void;
}

/** Render badge dot inside icon div — always top-right of icon, moves with it */
function BadgeDot() {
  return (
    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
  );
}

export default function SidebarItem({ menu, collapsed, badges, openMenu, setOpenMenu }: SidebarItemProps) {
  const pathname = usePathname();
  const itemRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const userClosedRef = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  const updatePopupPos = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPopupPos({ top: rect.top, left: rect.right + 8 });
    }
  }, []);

  const hasChildren = menu.children && menu.children.length > 0;

  const isChildActive = hasChildren
    ? menu.children!.some((child) => pathname.startsWith(child.href))
    : false;

  const active = menu.href
    ? menu.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(menu.href)
    : isChildActive;

  const isOpen = hasChildren
    ? openMenu === menu.label || (!collapsed && isChildActive) || (collapsed && isChildActive && !userClosedRef.current && openMenu === null ? false : openMenu === menu.label)
    : false;

  // Total badge count for expandable parent (sum of children badges)
  const totalBadge = hasChildren
    ? menu.children!.reduce((sum, c) => sum + (badges?.[c.badgeKey ?? ""] ?? 0), 0)
    : 0;

  function toggleOpen() {
    userClosedRef.current = false;
    const willOpen = openMenu !== menu.label;
    if (willOpen && collapsed && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPopupPos({ top: rect.top, left: rect.right + 8 });
    }
    setOpenMenu(willOpen ? menu.label : null);
  }

  function handleChildClick() {
    userClosedRef.current = true;
    setOpenMenu(null);
  }

  useEffect(() => {
    userClosedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!collapsed || !isOpen) return;
    updatePopupPos();

    function handleClickOutside(e: MouseEvent) {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function handleScroll() {
      updatePopupPos();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [collapsed, isOpen, setOpenMenu, updatePopupPos]);

  const Icon = menu.icon;

  const activeClasses = "bg-slate-100 text-slate-900 dark:bg-neutral-800 dark:text-white";
  const inactiveClasses = "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-neutral-800 dark:hover:text-white";

  // ─── Expandable parent with children ───
  if (hasChildren) {
    const hasBadge = totalBadge > 0;

    return (
      <div ref={itemRef} className="min-w-0 relative">
        {/* Parent button — no overflow-hidden so badge in icon div isn't clipped */}
        <button
          ref={btnRef}
          onClick={toggleOpen}
          title={collapsed ? menu.label : ""}
          className={`
            group
            relative
            flex
            h-12
            w-full
            items-center
            rounded-2xl

            transition-all
            duration-500
            ease-[cubic-bezier(.22,1,.36,1)]

            ${collapsed ? "justify-center px-0" : "justify-start gap-4 px-4"}

            ${active ? activeClasses : inactiveClasses}
          `}
        >
          {/* Active Indicator */}
          <span
            className={`
              absolute left-0 top-1/2 -translate-y-1/2
              rounded-r-full
              bg-gradient-to-b from-[#1184CA] via-[#844EC0] to-[#CA3785]
              transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
              ${active ? "h-8 w-1 opacity-100" : "h-0 w-1 opacity-0 group-hover:h-5 group-hover:opacity-40"}
            `}
          />

          {/* Icon + Badge */}
          <div
            className={`
              relative z-10
              flex items-center justify-center
              transition-all duration-300
              group-hover:scale-110
              ${active ? "text-dark dark:text-white" : "text-slate-500 dark:text-neutral-400"}
            `}
          >
            <Icon size={20} strokeWidth={2.2} />
            {hasBadge && <BadgeDot />}
          </div>

          {/* Label */}
          <span
            className={`
              relative z-10
              whitespace-nowrap text-left font-medium
              ${collapsed ? "" : "flex-1"}
              transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
              ${collapsed ? "w-0 -translate-x-3 opacity-0" : "w-auto translate-x-0 opacity-100"}
            `}
          >
            {menu.label}
          </span>

          {/* Chevron — only when expanded */}
          {!collapsed && (
            <ChevronDown
              size={16}
              className={`
                relative z-10
                text-slate-400
                transition-transform duration-300
                ${isOpen ? "rotate-180" : "rotate-0"}
              `}
            />
          )}

          {/* Hover Overlay */}
          {!active && (
            <span
              className="
                pointer-events-none absolute inset-0
                rounded-2xl opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
                bg-gradient-to-r from-[#1184CA]/5 via-[#844EC0]/5 to-[#CA3785]/5
              "
            />
          )}
        </button>

        {/* ─── Expanded mode: slide-down children ─── */}
        {!collapsed && (
          <div
            className={`
              overflow-hidden
              transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]
              ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="pl-4 space-y-0.5 pt-1 pb-1">
              {menu.children!.map((child) => {
                const ChildIcon = child.icon;
                const childActive = pathname.startsWith(child.href);

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`
                      group relative flex h-11 items-center
                      rounded-xl transition-all duration-300
                      justify-start gap-3 px-3
                      ${childActive ? activeClasses : "text-slate-500 dark:text-neutral-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-neutral-800 dark:hover:text-white"}
                    `}
                  >
                    {/* Child Icon */}
                    <div
                      className={`
                        relative z-10 flex items-center justify-center
                        transition-colors duration-300 group-hover:scale-110
                        ${childActive ? "text-dark dark:text-white" : "text-slate-400 dark:text-neutral-500"}
                      `}
                    >
                      <ChildIcon size={18} strokeWidth={2.2} />
                      {child.badgeKey && badges && (badges[child.badgeKey] ?? 0) > 0 && <BadgeDot />}
                    </div>

                    {/* Child Label */}
                    <span
                      className={`
                        relative z-10 whitespace-nowrap text-[13px] font-medium
                        transition-all duration-300
                        ${childActive ? "text-slate-900 dark:text-white" : ""}
                      `}
                    >
                      {child.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Collapsed mode: floating popup submenu (portal) ─── */}
        {mounted && collapsed && isOpen && createPortal(
          <div
            ref={itemRef}
            className="
              fixed z-[9999] w-44 overflow-hidden rounded-xl
              border shadow-xl
              border-slate-200 bg-white
              dark:border-white/10 dark:bg-dark-card
              transition-opacity duration-200
            "
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            {menu.children!.map((child) => {
              const ChildIcon = child.icon;
              const childActive = pathname.startsWith(child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={handleChildClick}
                  className={`
                    flex w-full items-center gap-3
                    px-4 py-3 text-sm font-medium
                    transition-colors duration-300
                    ${childActive ? "bg-slate-50 text-slate-900 dark:bg-white/10 dark:text-white" : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"}
                  `}
                >
                  <ChildIcon size={16} />
                  <span className="whitespace-nowrap">{child.label}</span>

                  {child.badgeKey && badges && (badges[child.badgeKey] ?? 0) > 0 && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Link>
              );
            })}
          </div>,
          document.body
        )}
      </div>
    );
  }

  // ─── Simple link (no children) ───
  const hasBadge = menu.badgeKey && badges && (badges[menu.badgeKey] ?? 0) > 0;

  return (
    <Link
      href={menu.href!}
      title={collapsed ? menu.label : ""}
      className={`
        group
        relative
        flex
        h-12
        items-center
        rounded-2xl

        transition-all
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]

        ${collapsed ? "justify-center px-0" : "justify-start gap-4 px-4"}

        ${active ? activeClasses : inactiveClasses}
      `}
    >
      {/* Active Indicator */}
      <span
        className={`
          absolute left-0 top-1/2 -translate-y-1/2
          rounded-r-full
          bg-gradient-to-b from-[#1184CA] via-[#844EC0] to-[#CA3785]
          transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
          ${active ? "h-8 w-1 opacity-100" : "h-0 w-1 opacity-0 group-hover:h-5 group-hover:opacity-40"}
        `}
      />

      {/* Icon + Badge */}
      <div
        className={`
          relative z-10
          flex items-center justify-center
          transition-all duration-300
          group-hover:scale-110
          ${active ? "text-dark dark:text-white" : "text-slate-500 dark:text-neutral-400"}
        `}
      >
        <Icon size={20} strokeWidth={2.2} />
        {hasBadge && <BadgeDot />}
      </div>

      {/* Label */}
      <span
        className={`
          relative z-10
          whitespace-nowrap
          font-medium
          transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
          ${collapsed ? "w-0 -translate-x-3 opacity-0" : "w-auto translate-x-0 opacity-100"}
        `}
      >
        {menu.label}
      </span>

      {/* Hover Overlay */}
      {!active && (
        <span
          className="
            pointer-events-none absolute inset-0
            rounded-2xl opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
            bg-gradient-to-r from-[#1184CA]/5 via-[#844EC0]/5 to-[#CA3785]/5
          "
        />
      )}
    </Link>
  );
}
