"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import DaftarModal from "../DaftarModal";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import { navigation } from "@/data/navigation";

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
        ? "bg-transparent backdrop-blur-0 border-b border-white/20"
        : "bg-light dark:bg-dark/40 backdrop-blur-xl border-b border-black/10 dark:border-white/10"
    }
  `}
      >
        <Link
          href="/"
          className={`text-xl font-bold tracking-wide ${
            pathname === "/" && !scrolled
              ? "text-white"
              : "text-black dark:text-white"
          }`}
        >
          etamhub.
        </Link>

        <button
          onClick={() => setOpen(true)}
          className={`text-xl ${
            pathname === "/" && !scrolled
              ? "text-white"
              : "text-black dark:text-white"
          }`}
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
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="text-lg cursor-pointer pr-3"
            >
              {mounted &&
                (resolvedTheme === "dark" ? (
                  <IoIosSunny className="text-white hover:text-zinc-300 duration-200" />
                ) : (
                  <IoIosMoon className="text-black hover:text-zinc-700 duration-200" />
                ))}
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
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-black dark:text-white text-xl font-medium"
            >
              {item.label}
            </Link>
          ))}
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
