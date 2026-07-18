"use client";

import { useState } from "react";
import Link from "next/link";
import DaftarModal from "../DaftarModal";
import { usePathname } from "next/navigation";
import SmallChevronButton from "../button/SmallChevronButton";
import { navigation } from "@/data/navigation";

export default function HeroNavbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <header className="hidden lg:block absolute top-0 left-0 w-full z-30">
      <div className="px-8 py-8">
        <div className="grid grid-cols-3 items-start">
          {/* Left Menu */}
          <nav className="flex flex-col items-start gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition text-sm ${
                  isHome
                    ? "text-white hover:text-white/80 dark:text-white/90 dark:hover:text-white"
                    : "text-black hover:text-black/80 dark:text-white/90 dark:hover:text-white"
                } duration-300`}
              >
                {item.label}
              </Link>
            ))}
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
