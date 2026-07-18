"use client";

import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";

type BigChevronButtonProps = {
  title: string;
  onClick: () => void;
};

export default function BigChevronButtonButton({
  title,
  onClick,
}: BigChevronButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        bg-black
        hover:bg-zinc-800
        dark:bg-white
        dark:hover:bg-zinc-300
        transition-colors
        duration-500
        rounded-lg
        py-[3px]
        px-[3px]
        sm:py-[4px]
        sm:px-[4px]
        flex
        items-center
        shadow-lg
        w-fit
        cursor-pointer
      "
    >
      <span
        className="
          px-3
          sm:px-4
          lg:px-[10px]
          text-sm
          sm:text-base
          lg:text-md
          font-medium
          text-white
          dark:text-black
        "
      >
        {title}
      </span>

      <span
        className="
          relative
          overflow-hidden
          w-9
          h-9
          sm:w-10
          sm:h-10
          lg:w-11
          lg:h-11
          bg-white
          dark:bg-black
          rounded-md
          flex
          items-center
          justify-center
        "
      >
        {/* Definisi Linear Gradient untuk SVG */}
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient id="chevron-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              {/* Stop Kiri: Ungu (#a855f7 adalah warna purple-500 Tailwind) */}
              <stop offset="0%" className="[stop-color:#a855f7]" />
              {/* Stop Kanan: Hitam di Light Mode, Putih di Dark Mode */}
              <stop
                offset="100%"
                className="[stop-color:#a855f7] dark:[stop-color:#ffffff] transition-colors duration-500"
              />
            </linearGradient>
          </defs>
        </svg>

        <IoChevronForward
          size={20}
          style={{ fill: "url(#chevron-grad)", stroke: "url(#chevron-grad)" }}
          className={`absolute ${
            isHovered
              ? "translate-x-5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "translate-x-0 opacity-100 transition-none"
          }`}
        />

        <IoChevronForward
          size={20}
          style={{ fill: "url(#chevron-grad)", stroke: "url(#chevron-grad)" }}
          className={`absolute ${
            isHovered
              ? "translate-x-0 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "-translate-x-5 opacity-0 transition-none"
          }`}
        />
      </span>
    </button>
  );
}