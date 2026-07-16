"use client";

import Link from "next/link";
import { VscChevronRight } from "react-icons/vsc";

export default function HeroNavbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-30">
      <div className="px-8 py-8">
        <div className="grid grid-cols-3 items-start">
          {/* Left Menu */}
          <nav className="flex flex-col items-start gap-2">
            <Link
              href="/"
              className="text-white/90 hover:text-white transition text-sm"
            >
              Beranda
            </Link>

            <Link
              href="/#kecamatan"
              className="text-white/90 hover:text-white transition text-sm"
            >
              Kecamatan
            </Link>

            <Link
              href="/about"
              className="text-white/90 hover:text-white transition text-sm"
            >
              Tentang
            </Link>
          </nav>

          {/* Center Logo */}
          <div className="flex justify-center items-start">
            <Link
              href="/"
              className="text-white font-semibold text-2xl tracking-tight"
            >
              etamhub.
            </Link>
          </div>

          {/* Right Button */}
          <div className="flex justify-end items-start">
            <Link
              href="/daftar"
              className="
                bg-white
                rounded-md
                p-[2.5px]
                flex
                items-center
                shadow-lg
                w-fit
              "
            >
              <span className="px-2 py-1 text-black text-sm font-medium">
                Daftar UMKM
              </span>

              <span
                className="
                  w-8
                  h-8
                  bg-black
                  rounded
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <VscChevronRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
