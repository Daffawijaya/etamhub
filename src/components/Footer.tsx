"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer
      className={`${
        isHome
          ? "bg-gry"
          : "bg-white border-t border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight">
              Etam<span className="text-primary">Hub</span>
            </h3>

            <p className="mt-3 max-w-md text-slate-600 leading-relaxed">
              Platform katalog UMKM Kutai Kartanegara untuk membantu masyarakat
              menemukan usaha dan produk lokal unggulan.
            </p>
          </div>

          {/* Menu */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-slate-600">
            <Link
              href="/"
              className="hover:text-primary transition"
            >
              Beranda
            </Link>

            <Link
              href="/about"
              className="hover:text-primary transition"
            >
              Tentang
            </Link>

            <Link
              href="/kontak"
              className="hover:primary transition"
            >
              Kontak
            </Link>
          </div>
        </div>

        <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500 text-center">
            © {new Date().getFullYear()} EtamHub
          </p>

          <p className="text-sm text-slate-500 text-center">
            Dinas Koperasi & UKM Kutai Kartanegara
          </p>
        </div>
      </div>
    </footer>
  );
}