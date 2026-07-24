"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

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
      className={`
  absolute
  top-9
  z-50

  ${collapsed ? "-right-3" : "right-2"}

  flex
  h-5
  w-5
  items-center
  justify-center
  rounded-sm
  text-slate-500
  dark:text-neutral-400
bg-white dark:bg-dark-card
  transition-all
  duration-300
  ease-[cubic-bezier(.22,1,.36,1)]

  hover:bg-slate-100
  dark:hover:bg-neutral-800

  hover:text-slate-900
  dark:hover:text-white

  active:scale-95
`}
    >
      {collapsed ? (
        <ChevronRight size={18} strokeWidth={2.5} />
      ) : (
        <ChevronLeft size={18} strokeWidth={2.5} />
      )}
    </button>
  );
}
