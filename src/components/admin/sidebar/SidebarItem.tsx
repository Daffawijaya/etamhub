"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarMenu } from "./sidebar-data";

interface SidebarItemProps {
  menu: SidebarMenu;
  collapsed: boolean;
}

export default function SidebarItem({ menu, collapsed }: SidebarItemProps) {
  const pathname = usePathname();

  const Icon = menu.icon;

  const active =
    menu.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(menu.href);

  return (
    <Link
      href={menu.href}
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
          relative
          z-10

          flex
          items-center
          justify-center

          transition-all
          duration-300

          group-hover:scale-110

          ${active ? "text-dark dark:text-white" : "text-slate-500 dark:text-neutral-400"}
        `}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>

      {/* Label */}
      <span
        className={`
          relative
          z-10

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

      {/* Hover Overlay */}
      {!active && (
        <span
          className="
            pointer-events-none
            absolute
            inset-0

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
