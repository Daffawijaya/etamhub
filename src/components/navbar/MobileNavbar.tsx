"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import DaftarModal from "../DaftarModal";
import { IoIosMoon, IoIosSunny } from "react-icons/io";

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const pathname = usePathname();

  const transparentPage = pathname === "/" || pathname === "/about";

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
          
          transition-all duration-300
          ${
            transparentPage && !scrolled
              ? "bg-transparent backdrop-blur-0 border-b border-black/10 dark:border-white/10"
              : "bg-light dark:bg-dark/40 backdrop-blur-xl border-b border-white dark:border-white/10"
          }
        `}
      >
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-black dark:text-white"
        >
          etamhub.
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="text-black dark:text-white text-xl"
        >
          <FiMenu />
        </button>
      </nav>

      {/* Fullscreen Menu */}
      <div
        className={`
          fixed inset-0 z-[60]
          bg-light dark:bg-dark
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white dark:border-white/10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-xl font-bold tracking-wide text-black dark:text-white"
          >
            etamhub.
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="
    w-10 h-10
    flex items-center justify-center
    text-black dark:text-white
    text-xl
  "
            >
              {mounted &&
                (resolvedTheme === "dark" ? <IoIosSunny /> : <IoIosMoon />)}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="text-black dark:text-white text-3xl"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col px-6 pt-10 gap-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-black dark:text-white text-xl font-medium"
          >
            Beranda
          </Link>

          <Link
            href="/#kecamatan"
            onClick={() => setOpen(false)}
            className="text-black dark:text-white text-xl font-medium"
          >
            Kecamatan
          </Link>

          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="text-black dark:text-white text-xl font-medium"
          >
            Tentang
          </Link>
        </div>

        {/* Button */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={() => {
              setOpen(false);
              setIsModalOpen(true);
            }}
            className="
              w-full h-11 rounded-lg
              flex items-center justify-center
              bg-white text-black
              text-sm font-medium
              hover:bg-zinc-200
              transition-colors
            "
          >
            Daftar UMKM
          </button>
        </div>
      </div>

      <DaftarModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
