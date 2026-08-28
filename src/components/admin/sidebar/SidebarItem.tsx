"use client";

import { useRef, useEffect } from "react";
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

export default function SidebarItem({ menu, collapsed, badges, openMenu, setOpenMenu }: SidebarItemProps) {
  const pathname = usePathname();
  const itemRef = useRef<HTMLDivElement>(null);

  const hasChildren = menu.children && menu.children.length > 0;

  // Check if any child is active
  const isChildActive = hasChildren
    ? menu.children!.some((child) => pathname.startsWith(child.href))
    : false;

  // Parent is active if href matches or any child is active
  const active = menu.href
    ? menu.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(menu.href)
    : isChildActive;

  // Use shared openMenu state — accordion behavior
  const isOpen = hasChildren ? openMenu === menu.label || isChildActive : false;

  function toggleOpen() {
    setOpenMenu(openMenu === menu.label ? null : menu.label);
  }

  // Close popup when clicking outside
  useEffect(() => {
    if (!collapsed || !isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed, isOpen, setOpenMenu]);

  const Icon = menu.icon;

  // ─── Expandable parent with children ───
  if (hasChildren) {
    return (
      <div ref={itemRef} className="min-w-0 relative">
        {/* Parent button */}
        <button
          onClick={toggleOpen}
          title={collapsed ? menu.label : ""}
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

            ${
              active
                ? `
                  bg-slate-100
                  text-slate-900
                  dark:bg-neutral-800
                  dark:text-white
                `
                : `
                  text-slate-600
                  dark:text-neutral-300

                  hover:bg-slate-100
                  hover:text-slate-900

                  dark:hover:bg-neutral-800
                  dark:hover:text-white
                `
            }
          `}
        >
          {/* Active Indicator */}
          <span
            className={`
              absolute
              left-0
              top-1/2
              -translate-y-1/2

              rounded-r-full

              bg-gradient-to-b
              from-[#1184CA]
              via-[#844EC0]
              to-[#CA3785]

              transition-all
              duration-500
              ease-[cubic-bezier(.22,1,.36,1)]

              ${
                active
                  ? "h-8 w-1 opacity-100"
                  : "h-0 w-1 opacity-0 group-hover:h-5 group-hover:opacity-40"
              }
            `}
          />

          {/* Icon */}
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
          </div>

          {/* Label */}
          <span
            className={`
              relative z-10
              whitespace-nowrap text-left font-medium
              ${collapsed ? "" : "flex-1"}

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
            {menu.label}
          </span>

          {/* Chevron — only when expanded */}
          {!collapsed && (
            <ChevronDown
              size={16}
              className={`
                relative z-10
                text-slate-400
                transition-transform
                duration-300
                ${isOpen ? "rotate-180" : "rotate-0"}
              `}
            />
          )}

          {/* Badge — sum of children badges */}
          {(() => {
            const totalBadge = hasChildren
              ? menu.children!.reduce((sum, c) => sum + (badges?.[c.badgeKey ?? ""] ?? 0), 0)
              : 0;
            return totalBadge > 0 ? (
              <span
                className={`
                  absolute z-10 flex h-5 min-w-5 items-center justify-center
                  rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white
                  ${collapsed ? "-right-1 -top-1" : "right-8"}
                `}
              >
                {totalBadge > 99 ? "99+" : totalBadge}
              </span>
            ) : null;
          })()}

          {/* Hover Overlay */}
          {!active && (
            <span
              className="
                pointer-events-none
                absolute inset-0

                rounded-2xl

                opacity-0

                transition-opacity
                duration-300

                group-hover:opacity-100

                bg-gradient-to-r
                from-[#1184CA]/5
                via-[#844EC0]/5
                to-[#CA3785]/5
              "
            />
          )}
        </button>

        {/* ─── Expanded mode: slide-down children ─── */}
        {!collapsed && (
          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ease-[cubic-bezier(.22,1,.36,1)]
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
                      group
                      relative
                      flex
                      h-11
                      items-center
                      overflow-hidden
                      rounded-xl

                      transition-all
                      duration-300

                      justify-start gap-3 px-3

                      ${
                        childActive
                          ? `
                            bg-slate-100
                            text-slate-900
                            dark:bg-neutral-800
                            dark:text-white
                          `
                          : `
                            text-slate-500
                            dark:text-neutral-400

                            hover:bg-slate-100
                            hover:text-slate-900

                            dark:hover:bg-neutral-800
                            dark:hover:text-white
                          `
                      }
                    `}
                  >
                    {/* Child Icon */}
                    <div
                      className={`
                        relative z-10
                        flex items-center justify-center
                        transition-colors duration-300
                        group-hover:scale-110
                        ${childActive ? "text-dark dark:text-white" : "text-slate-400 dark:text-neutral-500"}
                      `}
                    >
                      <ChildIcon size={18} strokeWidth={2.2} />
                    </div>

                    {/* Child Label */}
                    <span
                      className={`
                        relative z-10
                        whitespace-nowrap
                        text-[13px] font-medium

                        transition-all
                        duration-300

                        ${childActive ? "text-slate-900 dark:text-white" : ""}
                      `}
                    >
                      {child.label}
                    </span>

                    {/* Child Badge */}
                    {child.badgeKey && badges && (badges[child.badgeKey] ?? 0) > 0 && (
                      <span className="absolute right-3 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {badges[child.badgeKey] > 99 ? "99+" : badges[child.badgeKey]}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Collapsed mode: floating popup submenu ─── */}
        {collapsed && isOpen && (
          <div
            className="
              absolute left-full top-0 z-[200]
              ml-2
              min-w-[180px]
              rounded-xl
              bg-white
              py-1.5
              shadow-lg shadow-black/10
              ring-1 ring-black/5
              dark:bg-neutral-800 dark:shadow-black/30 dark:ring-white/10

              animate-in fade-in slide-in-from-left-2
            "
            style={{ animationDuration: "150ms" }}
          >
            {/* Parent label header */}
            <div className="px-3 pb-1.5 mb-1 border-b border-slate-100 dark:border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {menu.label}
              </span>
            </div>

            {menu.children!.map((child) => {
              const ChildIcon = child.icon;
              const childActive = pathname.startsWith(child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`
                    flex items-center gap-2.5
                    px-3 py-2 mx-1 rounded-lg
                    text-sm font-medium
                    transition-colors duration-150

                    ${
                      childActive
                        ? "bg-slate-100 text-slate-900 dark:bg-neutral-700 dark:text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                    }
                  `}
                >
                  <ChildIcon size={16} strokeWidth={2} className={childActive ? "text-[#1184CA]" : "text-slate-400 dark:text-slate-500"} />
                  <span className="whitespace-nowrap">{child.label}</span>

                  {child.badgeKey && badges && (badges[child.badgeKey] ?? 0) > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {badges[child.badgeKey] > 99 ? "99+" : badges[child.badgeKey]}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── Simple link (no children) ───
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
        overflow-hidden
        rounded-2xl

        transition-all
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]

        ${collapsed ? "justify-center px-0" : "justify-start gap-4 px-4"}

        ${
          active
            ? `
              bg-slate-100
              text-slate-900
              dark:bg-neutral-800
              dark:text-white
            `
            : `
              text-slate-600
              dark:text-neutral-300

              hover:bg-slate-100
              hover:text-slate-900

              dark:hover:bg-neutral-800
              dark:hover:text-white
            `
        }
      `}
    >
      {/* Active Indicator */}
      <span
        className={`
          absolute
          left-0
          top-1/2
          -translate-y-1/2

          rounded-r-full

          bg-gradient-to-b
          from-[#1184CA]
          via-[#844EC0]
          to-[#CA3785]

          transition-all
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]

          ${
            active
              ? "h-8 w-1 opacity-100"
              : "h-0 w-1 opacity-0 group-hover:h-5 group-hover:opacity-40"
          }
        `}
      />

      {/* Icon */}
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
      </div>

      {/* Label */}
      <span
        className={`
          relative z-10
          whitespace-nowrap
          font-medium

          transition-all
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]

          ${
            collapsed
              ? `
                w-0
                -translate-x-3
                opacity-0
              `
              : `
                w-auto
                translate-x-0
                opacity-100
              `
          }
        `}
      >
        {menu.label}
      </span>

      {/* Badge */}
      {menu.badgeKey && badges && (badges[menu.badgeKey] ?? 0) > 0 && (
        <span
          className={`
            absolute z-10 flex h-5 min-w-5 items-center justify-center
            rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white
            ${collapsed ? "-right-1 -top-1" : "right-3"}
          `}
        >
          {badges[menu.badgeKey] > 99 ? "99+" : badges[menu.badgeKey]}
        </span>
      )}

      {/* Hover Overlay */}
      {!active && (
        <span
          className="
            pointer-events-none
            absolute inset-0

            rounded-2xl

            opacity-0

            transition-opacity
            duration-300

            group-hover:opacity-100

            bg-gradient-to-r
            from-[#1184CA]/5
            via-[#844EC0]/5
            to-[#CA3785]/5
          "
        />
      )}
    </Link>
  );
}
