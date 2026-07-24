"use client";

import Image from "next/image";

interface SidebarLogoProps {
  collapsed: boolean;
}

export default function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div>
      <div
        className={`
          relative
          flex
          items-center
          overflow-hidden
          transition-all
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]
          ${collapsed ? "justify-center py-5" : "p-5"}
        `}
      >
        {/* Icon */}
        <div
          className={`
            flex-shrink-0
            transition-all
            duration-500
            ease-[cubic-bezier(.22,1,.36,1)]
            ${
              collapsed
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 -rotate-6 pointer-events-none absolute"
            }
          `}
        >
          <Image
            src="/eiconb.png"
            alt="etamhub."
            width={42}
            height={42}
            priority
            className="rounded-xl"
          />
        </div>

        {/* Text */}
        <div
          className={`
            overflow-hidden
            transition-all
            duration-500
            ease-[cubic-bezier(.22,1,.36,1)]
            ${
              collapsed
                ? "max-w-0 opacity-0 -translate-x-4 scale-95 pointer-events-none"
                : "max-w-xs opacity-100 translate-x-0 scale-100"
            }
          `}
        >
          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-white
              whitespace-nowrap
            "
          >
            etamhub.
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
              dark:text-neutral-400
              whitespace-nowrap
            "
          >
            Admin Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
