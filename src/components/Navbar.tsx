"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isHero, setIsHero] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsHero(false);
      return;
    }

    const handleScroll = () => {
      setIsHero(window.scrollY < 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        !isHome ? "border-b border-slate-200" : ""
      }`}
    >
      {/* Hero Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isHero && isHome ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Scroll Background */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-500 ${
          isHero && isHome ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-18 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <h1
              className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                isHero && isHome ? "text-white" : "text-slate-900"
              }`}
            >
              Etam
              <span
                className={`transition-colors duration-500 ${
                  isHero && isHome ? "text-white" : "text-primary"
                }`}
              >
                Hub
              </span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-md">
            <Link
              href="/"
              className={`font-medium transition-colors duration-500 ${
                isHero && isHome
                  ? "text-white hover:text-violet-200"
                  : "text-slate-700 hover:text-violet-600"
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/#district-section"
              className={`font-medium transition-colors duration-500 ${
                isHero && isHome
                  ? "text-white hover:text-violet-200"
                  : "text-slate-700 hover:text-violet-600"
              }`}
            >
              Kecamatan
            </Link>

            <Link
              href="/#about-section"
              className={`font-medium transition-colors duration-500 ${
                isHero && isHome
                  ? "text-white hover:text-violet-200"
                  : "text-slate-700 hover:text-violet-600"
              }`}
            >
              Tentang
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 transition-colors ${
              isHero && isHome ? "text-white" : "text-slate-900"
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

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-60 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`py-3 font-medium transition-colors ${
                isHero && isHome
                  ? "text-white hover:text-violet-200"
                  : "text-slate-700 hover:text-violet-600"
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/#district-section"
              onClick={() => setMobileOpen(false)}
              className={`py-3 font-medium transition-colors ${
                isHero && isHome
                  ? "text-white hover:text-violet-200"
                  : "text-slate-700 hover:text-violet-600"
              }`}
            >
              Kecamatan
            </Link>

            <Link
              href="/#about-section"
              onClick={() => setMobileOpen(false)}
              className={`py-3 font-medium transition-colors ${
                isHero && isHome
                  ? "text-white hover:text-violet-200"
                  : "text-slate-700 hover:text-violet-600"
              }`}
            >
              Tentang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
