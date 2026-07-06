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
      setIsHero(window.scrollY < window.innerHeight - 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const text = isHero && isHome ? "text-white" : "text-slate-800";
  const hover =
    isHero && isHome ? "hover:text-violet-200" : "hover:text-violet-600";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-300 ${
        isHero && isHome ? "bg-transparent" : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <h1 className={`text-2xl font-bold tracking-tight ${text}`}>
            Etam
            <span
              className={isHero && isHome ? "text-white" : "text-violet-600"}
            >
              Hub
            </span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={`${text} ${hover} transition`}>
            Beranda
          </Link>

          <Link
            href="/#district-section"
            className={`${text} ${hover} transition`}
          >
            Kecamatan
          </Link>

          <Link
            href="/#about-section"
            className={`${text} ${hover} transition`}
          >
            Tentang
          </Link>
        </div>
      </div>
    </nav>
  );
}
