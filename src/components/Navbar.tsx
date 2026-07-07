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
      // Transparan hanya saat benar-benar di paling atas
      setIsHero(window.scrollY === 0);
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
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isHero && isHome
          ? "bg-transparent"
          : "bg-white/50 backdrop-blur-md shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <h1 className={`text-2xl font-bold tracking-tight ${text}`}>
            Etam
            <span className={isHero && isHome ? "text-white" : "text-primary"}>
              Hub
            </span>
          </h1>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className={`${text} ${hover} transition-colors`}>
            Beranda
          </Link>

          <Link
            href="/#district-section"
            className={`${text} ${hover} transition-colors`}
          >
            Kecamatan
          </Link>

          <Link
            href="/#about-section"
            className={`${text} ${hover} transition-colors`}
          >
            Tentang
          </Link>
        </div>
      </div>
    </nav>
  );
}
