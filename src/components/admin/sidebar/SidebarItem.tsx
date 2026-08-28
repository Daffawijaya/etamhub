"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { SidebarMenu } from "./sidebar-data";

interface SidebarItemProps {
  menu: SidebarMenu;
  collapsed: boolean;
  badge?: number;
}

export default function SidebarItem({ menu, collapsed, badge }: SidebarItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  // Auto-open if child is active
  const isOpen = hasChildren ? open || isChildActive : false;

  const Icon = menu.icon;

  // ─── Expandable parent with children ───
  if (hasChildren) {
    return (
      <div>
        {/* Parent button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
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
              flex-1 whitespace-nowrap text-left font-medium

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

          {/* Chevron */}
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

          {/* Badge */}
          {badge !== undefined && badge > 0 && (
            <span
              className={`
                absolute z-10 flex h-5 min-w-5 items-center justify-center
                rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white
                ${collapsed ? "-right-1 -top-1" : "right-3"}
              `}
            >
              {badge > 99 ? "99+" : badge}
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
        </button>

        {/* Children — smooth slide-down */}
        <div
          className={`
            overflow-hidden
            transition-all
            duration-300
            ease-[cubic-bezier(.22,1,.36,1)]
            ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className={`${collapsed ? "pl-0" : "pl-6"} space-y-0.5 pt-1`}>
            {menu.children!.map((child) => {
              const ChildIcon = child.icon;
              const childActive = pathname.startsWith(child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  title={collapsed ? child.label : ""}
                  className={`
                    group
                    relative
                    flex
                    h-10
                    items-center
                    overflow-hidden
                    rounded-xl

                    transition-all
                    duration-300

                    ${collapsed ? "justify-center px-0" : "justify-start gap-3 px-3"}

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

                          hover:bg-slate-50
                          hover:text-slate-700

                          dark:hover:bg-neutral-800/50
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  {/* Child active indicator */}
                  <span
                    className={`
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2

                      h-5
                      w-0.5
                      rounded-full

                      transition-all
                      duration-300

                      ${
                        childActive
                          ? "opacity-100 bg-gradient-to-b from-[#1184CA] via-[#844EC0] to-[#CA3785]"
                          : "opacity-0"
                      }
                    `}
                  />

                  {/* Child Icon */}
                  <div
                    className={`
                      relative z-10
                      flex items-center justify-center
                      transition-colors duration-300
                      ${childActive ? "text-dark dark:text-white" : "text-slate-400 dark:text-neutral-500"}
                    `}
                  >
                    <ChildIcon size={16} strokeWidth={2} />
                  </div>

                  {/* Child Label */}
                  {!collapsed && (
                    <span
                      className={`
                        relative z-10
                        whitespace-nowrap
                        text-sm font-medium

                        transition-all
                        duration-300

                        ${childActive ? "text-slate-900 dark:text-white" : ""}
                      `}
                    >
                      {child.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
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
      {badge !== undefined && badge > 0 && (
        <span
          className={`
            absolute z-10 flex h-5 min-w-5 items-center justify-center
            rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white
            ${collapsed ? "-right-1 -top-1" : "right-3"}
          `}
        >
          {badge > 99 ? "99+" : badge}
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
