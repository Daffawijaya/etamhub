"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

interface MobileNavbarProps {
  onDaftarClick: () => void;
}

export default function MobileNavbar({ onDaftarClick }: MobileNavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  const transparentPage =
    pathname === "/" || pathname === "/about";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`
          lg:hidden fixed top-0 left-0 z-50
          w-screen h-12
          flex items-center justify-between px-5
          border-b border-white/10
          transition-all duration-300
          ${
            transparentPage && !scrolled
              ? "bg-transparent backdrop-blur-0"
              : "bg-dark/9=40 backdrop-blur-xl"
          }
        `}
      >
        <Link href="/" className="text-xl font-bold tracking-wide text-white">
          etamhub.
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="text-white text-xl"
        >
          <FiMenu />
        </button>
      </nav>

      {/* Dropdown Menu */}
      <div
        className={`
          fixed top-0 left-0 z-[60]
          w-screen h-screen
          bg-[#121313]
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="h-16 flex items-center justify-end px-5">
          <button
            onClick={() => setOpen(false)}
            className="text-white text-3xl"
          >
            <FiX />
          </button>
        </div>

        <div className="flex flex-col px-6 pt-8 gap-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-white text-xl"
          >
            Beranda
          </Link>

          <Link
            href="/#kecamatan"
            onClick={() => setOpen(false)}
            className="text-white text-xl"
          >
            Kecamatan
          </Link>

          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="text-white text-xl"
          >
            Tentang
          </Link>
        </div>

        <div className="absolute bottom-6 left-0 w-screen px-6">
          <button
            onClick={() => {
              setOpen(false);
              onDaftarClick();
            }}
            className="
              w-full h-10 rounded-md
              flex text-sm font-medium
              items-center justify-center
              bg-white text-black
            "
          >
            Tambah UMKM
          </button>
        </div>
      </div>
    </>
  );
}