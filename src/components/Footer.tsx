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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Etam<span className="text-primary">Hub</span>
            </h3>

            <p className="mt-3 max-w-md text-slate-600">
              Platform katalog UMKM Kutai Kartanegara untuk membantu masyarakat
              menemukan usaha dan produk lokal unggulan.
            </p>
          </div>

          <div className="flex gap-6 text-slate-600">
            <Link href="/" className="hover:text-violet-600 transition">
              Beranda
            </Link>

            <Link href="/tentang" className="hover:text-violet-600 transition">
              Tentang
            </Link>

            <Link href="/kontak" className="hover:text-violet-600 transition">
              Kontak
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} EtamHub
          </p>

          <p className="text-sm text-slate-500">
            Dinas Koperasi & UKM Kutai Kartanegara
          </p>
        </div>
      </div>
    </footer>
  );
}
