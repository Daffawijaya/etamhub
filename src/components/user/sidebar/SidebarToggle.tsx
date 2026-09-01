"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function SidebarToggle({
  collapsed,
  onToggle,
}: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle Sidebar"
      title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
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

        text-slate-600
        dark:text-neutral-300

        hover:bg-slate-100
        hover:text-slate-900

        dark:hover:bg-neutral-800
        dark:hover:text-white
      `}
    >
      {/* Icon */}
      <div
        className="
          relative z-10
          flex items-center justify-center
          transition-all duration-300
          group-hover:scale-110
          text-slate-500 dark:text-neutral-400
        "
      >
        {collapsed ? (
          <PanelLeftOpen size={20} strokeWidth={2.2} />
        ) : (
          <PanelLeftClose size={20} strokeWidth={2.2} />
        )}
      </div>

      {/* Label */}
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
        Ciutkan
      </span>

      {/* Hover Overlay */}
      <span
        className="
          pointer-events-none absolute inset-0
          rounded-2xl opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
          bg-gradient-to-r from-[#1184CA]/5 via-[#844EC0]/5 to-[#CA3785]/5
        "
      />
    </button>
  );
}
