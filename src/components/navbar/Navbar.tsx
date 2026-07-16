"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DaftarModal from "../DaftarModal";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  const pathname = usePathname();

  const [openDaftarModal, setOpenDaftarModal] = useState(false);

  const [showNavbar, setShowNavbar] = useState(
    pathname !== "/" && pathname !== "/about",
  );

  useEffect(() => {
    const isHeroPage = pathname === "/" || pathname === "/about";

    if (!isHeroPage) {
      setShowNavbar(true);
      return;
    }

    const handleScroll = () => {
      setShowNavbar(window.scrollY > 200);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <nav
        className={`hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-500 ease-out ${
          showNavbar
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <div className="rounded-lg border border-zinc-700 bg-dark/40 backdrop-blur-xl">
          {/* Desktop Navbar */}
          <div className="md:flex items-center gap-8 pl-[15px] pr-[8px] h-[50px]">
            {/* Brand */}
            <Link href="/">
              <span className="text-white text-2xl font-semibold tracking-tight inline-block -translate-y-[2.4px]">
                e.
              </span>
            </Link>

            {/* Menu */}
            <div className="flex items-center gap-6">
              <NavLink href="/">Beranda</NavLink>

              <NavLink href="/#kecamatan">Kecamatan</NavLink>

              <NavLink href="/about">Tentang</NavLink>
            </div>

            {/* Button */}
            <button
              onClick={() => setOpenDaftarModal(true)}
              className="bg-white text-black px-3 py-2 rounded-md text-xs font-medium hover:bg-zinc-200 transition-colors"
            >
              Daftar UMKM
            </button>
          </div>
        </div>
      </nav>

      <MobileNavbar />

      <DaftarModal
        open={openDaftarModal}
        onClose={() => setOpenDaftarModal(false)}
      />
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
