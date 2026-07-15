"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DaftarModal from "./DaftarModal";

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-500 ease-out ${
          showNavbar
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <div className="rounded-lg border border-zinc-700/60 bg-[#111111]/40 backdrop-blur-xl">
          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center gap-8 pl-[15px] pr-[7px] h-[50px]">
            {/* Brand */}
            <Link href="/">
              <span className="text-white text-2xl font-semibold tracking-tight inline-block -translate-y-[2.4px]">
                e.
              </span>
            </Link>

            {/* Menu */}
            <div className="flex items-center gap-6">
              <NavLink href="/">Beranda</NavLink>

              <NavLink href="/#district-section">Kecamatan</NavLink>

              <NavLink href="/about">Tentang</NavLink>
            </div>

            {/* Button */}
            <button
              onClick={() => setOpenDaftarModal(true)}
              className="bg-white text-black px-3 py-2 rounded-sm text-xs font-medium hover:bg-zinc-200 transition-colors"
            >
              Daftar UMKM
            </button>
          </div>

          {/* Mobile Navbar */}
          <div className="md:hidden">
            <div className="flex items-center justify-between px-4 h-14 min-w-[320px]">
              <Link href="/">
                <span className="text-white text-base font-semibold tracking-tight">
                  EtamHub
                </span>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-white"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <svg
                    className="w-5 h-5"
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
                    className="w-5 h-5"
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

            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-zinc-700/60 px-4 py-4 flex flex-col gap-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  Beranda
                </Link>

                <Link
                  href="/#district-section"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  Kecamatan
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  Tentang
                </Link>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setOpenDaftarModal(true);
                  }}
                  className="bg-white text-black py-2.5 rounded-lg text-sm font-medium"
                >
                  Daftar UMKM
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
