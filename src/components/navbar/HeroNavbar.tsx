"use client";

import { useState } from "react";
import Link from "next/link";
import { VscChevronRight } from "react-icons/vsc";
import DaftarModal from "../DaftarModal";
import { usePathname } from "next/navigation";
import SmallChevronButton from "../button/SmallChevronButton";

export default function HeroNavbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <header className="hidden lg:block absolute top-0 left-0 w-full z-30">
      <div className="px-8 py-8">
        <div className="grid grid-cols-3 items-start">
          {/* Left Menu */}
          <nav className="flex flex-col items-start gap-2">
            <Link
              href="/"
              className={`transition text-sm ${
                isHome
                  ? "dark:text-white/90 dark:hover:text-white text-white hover:text-white/80 duration-300"
                  : "text-black hover:text-black/80 dark:text-white/90 dark:hover:text-white duration-300"
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/#kecamatan"
              className={`transition text-sm ${
                isHome
                  ? "dark:text-white/90 dark:hover:text-white text-white hover:text-white/80 duration-300"
                  : "text-black hover:text-black/80 dark:text-white/90 dark:hover:text-white duration-300"
              }`}
            >
              Kecamatan
            </Link>

            <Link
              href="/about"
              className={`transition text-sm ${
                isHome
                  ? "dark:text-white/90 dark:hover:text-white text-white hover:text-white/80 duration-300"
                  : "text-black hover:text-black/80 dark:text-white/90 dark:hover:text-white duration-300"
              }`}
            >
              Tentang
            </Link>
          </nav>

          {/* Center Logo */}
          <div className="flex justify-center items-start">
            <Link
              href="/"
              className={`transition font-semibold text-2xl tracking-tight ${
                isHome
                  ? "dark:text-white dark:hover:text-white/80 text-white hover:text-white/80 duration-300"
                  : "text-black hover:text-black/80 dark:text-white dark:hover:text-white/80 duration-300"
              }`}
            >
              etamhub.
            </Link>
          </div>

          {/* Right Button */}
          <div className="flex justify-end items-start">
            <SmallChevronButton
              title="Daftar UMKM"
              onClick={() => setIsModalOpen(true)}
            />
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
