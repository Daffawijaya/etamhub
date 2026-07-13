"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DaftarModal from "./DaftarModal";

export default function Navbar() {
  const pathname = usePathname();

  const isTransparentPage = pathname === "/" || pathname === "/about";

  const [isHero, setIsHero] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [openDaftarModal, setOpenDaftarModal] = useState(false);

  useEffect(() => {
    if (!isTransparentPage) {
      setIsHero(false);
      return;
    }

    const handleScroll = () => {
      setIsHero(window.scrollY < 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparentPage]);

  const navbarSolid = !isTransparentPage || !isHero || mobileOpen;

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      {/* Transparent State */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
          navbarSolid ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Solid State */}
      <div
        className={`absolute inset-0 bg-white border-b border-slate-200 transition-opacity duration-500 ease-in-out ${
          navbarSolid ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid h-18 md:h-20 grid-cols-[auto_1fr_auto] items-center">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-1"
          >
            <div className="relative h-7 w-7">
              <Image
                src="/iconsw.png"
                alt="EtamHub Logo White"
                fill
                className={`object-contain transition-opacity duration-500 ${
                  navbarSolid ? "opacity-0" : "opacity-100"
                }`}
                priority
              />

              <Image
                src="/iconz.png"
                alt="EtamHub Logo Color"
                fill
                className={`object-contain transition-opacity duration-500 ${
                  navbarSolid ? "opacity-100" : "opacity-0"
                }`}
                priority
              />
            </div>

            <h1
              className={`text-md sm:text-xl font-bold tracking-tight transition-colors duration-500 ease-in-out ${
                navbarSolid ? "text-slate-900" : "text-white"
              }`}
            >
              EtamHub
            </h1>
          </Link>

          {/* Desktop Menu Center */}
          <div className="hidden md:flex items-center justify-center gap-10 text-sm">
            <NavLink href="/" navbarSolid={navbarSolid}>
              Beranda
            </NavLink>

            <NavLink href="/#district-section" navbarSolid={navbarSolid}>
              Kecamatan
            </NavLink>

            <NavLink href="/about" navbarSolid={navbarSolid}>
              Tentang
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setOpenDaftarModal(true)}
              className={`px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                navbarSolid
                  ? "bg-primary text-white hover:opacity-90"
                  : "bg-white text-primary hover:bg-white/90"
              }`}
            >
              Daftar UMKM
            </button>
          </div>

          {/* Mobile Button */}
          <div className="flex justify-end md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 transition-colors duration-500 ease-in-out ${
                navbarSolid ? "text-slate-900" : "text-white"
              }`}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-80 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-200">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="py-3 font-medium text-slate-700 hover:text-primary transition-colors"
            >
              Beranda
            </Link>

            <Link
              href="/#district-section"
              onClick={() => setMobileOpen(false)}
              className="py-3 font-medium text-slate-700 hover:text-primary transition-colors"
            >
              Kecamatan
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="py-3 font-medium text-slate-700 hover:text-primary transition-colors"
            >
              Tentang
            </Link>

            <button
              onClick={() => {
                setMobileOpen(false);
                setOpenDaftarModal(true);
              }}
              className="mt-2 bg-primary text-white text-center py-3 rounded-xl font-semibold"
            >
              Daftar UMKM
            </button>
          </div>
        </div>
      </div>
      <DaftarModal
        open={openDaftarModal}
        onClose={() => setOpenDaftarModal(false)}
      />
    </nav>
  );
}

function NavLink({
  href,
  children,
  navbarSolid,
}: {
  href: string;
  children: React.ReactNode;
  navbarSolid: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-medium transition-colors duration-500 ease-in-out ${
        navbarSolid
          ? "text-slate-700 hover:text-primary"
          : "text-white hover:text-white/80"
      }`}
    >
      {children}
    </Link>
  );
}
