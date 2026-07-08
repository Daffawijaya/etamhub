"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isHero, setIsHero] = useState(true);

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
      {/* Background Gradient Hero */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          isHero && isHome ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Background Scroll */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-500 ease-out ${
          isHero && isHome ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/">
          <h1
            className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${
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
        <div className="hidden items-center gap-8 text-md md:flex">
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
      </div>
    </nav>
  );
}
