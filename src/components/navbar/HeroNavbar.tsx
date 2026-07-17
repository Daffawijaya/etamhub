"use client";

import { useState } from "react";
import Link from "next/link";
import { VscChevronRight } from "react-icons/vsc";
import DaftarModal from "../DaftarModal";

export default function HeroNavbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="hidden lg:block absolute top-0 left-0 w-full z-30">
      <div className="px-8 py-8">
        <div className="grid grid-cols-3 items-start">
          {/* Left Menu */}
          <nav className="flex flex-col items-start gap-2">
            <Link
              href="/"
              className="text-black hover:black/70 dark:text-white/90 dark:hover:text-white transition text-sm"
            >
              Beranda
            </Link>

            <Link
              href="/#kecamatan"
              className="text-black hover:black/70 dark:text-white/90 dark:hover:text-white transition text-sm"
            >
              Kecamatan
            </Link>

            <Link
              href="/about"
              className="text-black hover:black/70 dark:text-white/90 dark:hover:text-white transition text-sm"
            >
              Tentang
            </Link>
          </nav>

          {/* Center Logo */}
          <div className="flex justify-center items-start">
            <Link
              href="/"
              className="text-black dark:text-white font-semibold text-2xl tracking-tight"
            >
              etamhub.
            </Link>
          </div>

          {/* Right Button */}
          <div className="flex justify-end items-start">
            <button
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="
                bg-white
                hover:bg-zinc-300
                transition-colors
                duration-500
                rounded-lg
                p-[2.5px]
                flex
                items-center
                shadow-lg
                w-fit
                cursor-pointer
              "
            >
              <span className="px-2 py-1 text-black text-sm font-medium">
                Daftar UMKM
              </span>

              <span className="relative overflow-hidden w-8 h-8 bg-black rounded-md flex items-center justify-center text-white">
                <VscChevronRight
                  size={15}
                  className={`
                    absolute
                    ${
                      isHovered
                        ? "translate-x-5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        : "translate-x-0 opacity-100 transition-none"
                    }
                  `}
                />

                <VscChevronRight
                  size={15}
                  className={`
                    absolute
                    ${
                      isHovered
                        ? "translate-x-0 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        : "-translate-x-5 opacity-0 transition-none"
                    }
                  `}
                />
              </span>
            </button>
          </div>

          <DaftarModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
