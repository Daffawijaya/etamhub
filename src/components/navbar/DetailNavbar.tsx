"use client";

import { useTheme } from "next-themes";
import { IoIosSunny, IoIosMoon } from "react-icons/io";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import DaftarModal from "../DaftarModal";

export default function DetailNavbar() {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className="
          fixed top-0 left-0 z-50
          w-full h-14
          border-b border-white bg-light dark:border-zinc-700 dark:bg-dark/40 backdrop-blur-xl 
        "
      >
        <div className="max-w-7xl mx-auto h-full px-5 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-wide text-black dark:text-white"
          >
            etamhub.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm text-black hover:text-black/80 dark:text-white/80 dark:hover:text-white transition"
            >
              Beranda
            </Link>

            <Link
              href="/#kecamatan"
              className="text-sm text-black hover:text-black/80 dark:text-white/80 dark:hover:text-white transition"
            >
              Kecamatan
            </Link>

            <Link
              href="/about"
              className="text-sm text-black hover:text-black/80 dark:text-white/80 dark:hover:text-white transition"
            >
              Tentang
            </Link>
          </div>

          {/* Desktop Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="text-lg cursor-pointer pr-3"
            >
              {resolvedTheme === "dark" ? (
                <IoIosSunny className="text-white hover:text-zinc-300 duration-200" />
              ) : (
                <IoIosMoon className="text-black hover:text-zinc-700 duration-200" />
              )}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="
      h-10 px-5 rounded-md
      bg-white text-black
      text-sm font-medium
      transition hover:opacity-90
    "
            >
              Daftar UMKM
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-black dark:text-white text-xl"
          >
            <FiMenu />
          </button>
        </div>
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
              {resolvedTheme === "dark" ? (
                <IoIosSunny className="text-white hover:text-zinc-300 duration-200" />
              ) : (
                <IoIosMoon className="text-black hover:text-zinc-700 duration-200" />
              )}
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
