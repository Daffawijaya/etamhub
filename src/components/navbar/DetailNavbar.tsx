"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import DaftarModal from "../DaftarModal";

export default function DetailNavbar() {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav
        className="
          fixed top-0 left-0 z-50
          w-full h-14
          border-b border-zinc-700 bg-dark/40 backdrop-blur-xl 
        "
      >
        <div className="max-w-7xl mx-auto h-full px-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-wide text-white">
            etamhub.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm text-white/80 hover:text-white transition"
            >
              Beranda
            </Link>

            <Link
              href="/#kecamatan"
              className="text-sm text-white/80 hover:text-white transition"
            >
              Kecamatan
            </Link>

            <Link
              href="/about"
              className="text-sm text-white/80 hover:text-white transition"
            >
              Tentang
            </Link>
          </div>

          {/* Desktop Button */}
          <div className="hidden lg:block">
            <button
              onClick={() => setIsModalOpen(true)}
              className="
                h-10 px-5 rounded-md
                bg-white text-black
                text-sm font-medium
                transition hover:opacity-90
              "
            >
              Tambah UMKM
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-white text-xl"
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 left-0 z-[60]
          w-full h-screen
          bg-dark
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-white/10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-xl font-bold tracking-wide text-white"
          >
            etamhub.
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="text-white text-3xl"
          >
            <FiX />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-8 px-6 pt-8">
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

        {/* Mobile Button */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={() => {
              setOpen(false);
              setIsModalOpen(true);
            }}
            className="
              w-full h-10 rounded-md
              flex items-center justify-center
              bg-white text-black
              text-sm font-medium
            "
          >
            Tambah UMKM
          </button>
        </div>
      </div>

      <DaftarModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
