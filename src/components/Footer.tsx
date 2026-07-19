"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { navigation } from "@/data/navigation";

export default function Footer({ title }: { title?: ReactNode }) {
  return (
    <footer className="border-t-[0.5px] border-light dark:border-white/10 relative overflow-hidden bg-light dark:bg-dark text-black dark:text-white transition-colors">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 z-20">
        {title && (
          <>
            <div className="py-10 sm:py-12 md:py-16 text-center flex justify-center items-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed max-w-3xl">
                {title}
              </h2>
            </div>

            <div
              className="w-full h-px hidden dark:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, transparent 42%, rgba(0,0,0,0.12) 50%, transparent 58%, transparent 100%)",
              }}
            />

            <div
              className="w-full h-px dark:hidden"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, transparent 42%, rgba(255,255,255,0.20) 50%, transparent 58%, transparent 100%)",
              }}
            />
          </>
        )}

        {/* Main Footer */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-14 py-12 md:py-16 ${
            !title ? "" : "border-t border-black/5 dark:border-white/5"
          }`}
        >
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              etamhub.
            </h3>

            <p className="mt-5 md:mt-8 text-black/60 dark:text-white/60">
              Kutai Kartanegara
            </p>
          </div>

          {/* Menu */}
          <div className="text-center md:text-left">
            <p className="text-black/40 dark:text-white/40 text-sm mb-4 md:mb-5">
              Navigasi
            </p>

            <div className="flex flex-col items-center md:items-start gap-3 md:gap-4">
              <Link
                href="/"
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition"
              >
                Beranda
              </Link>

              <Link
                href="/about"
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition"
              >
                Tentang
              </Link>

              <Link
                href="https://daffayanwijaya.vercel.app"
                target="_blank"
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition"
              >
                Kontak
              </Link>
            </div>
          </div>

          {/* UMKM */}
          <div className="text-center md:text-left">
            <p className="text-black/40 dark:text-white/40 text-sm mb-4 md:mb-5">
              Eksplorasi
            </p>

            <div className="flex flex-col items-center md:items-start gap-3 md:gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          {/* Contact */}
          <div className="text-center md:text-left">
            <div className="space-y-8">
              <div>
                <p className="text-black/40 dark:text-white/40 text-sm mb-4 md:mb-5">
                  Profil
                </p>

                <Link
                  href="/about#pendamping"
                  className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition"
                >
                  TA Pendamping UMKM
                </Link>
              </div>

              <div>
                <p className="text-black/40 dark:text-white/40 text-sm mb-4 md:mb-5">
                  Instagram
                </p>

                <Link
                  href="https://instagram.com/kawaku.kukar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition"
                >
                  @kawaku.kukar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
          py-6 md:py-8
          flex flex-col sm:flex-row
          items-center
          justify-between
          gap-4
          text-center
        "
        >
          <p className="text-sm text-black/40 dark:text-white/40">
            © {new Date().getFullYear()} etamhub.
          </p>

          <div
            className="
            flex
            flex-wrap
            justify-center
            items-center
            gap-x-5
            gap-y-2
          "
          >
            <p className="text-black/40 dark:text-white/40 transition text-sm">
              by Tenaga Ahli Pendamping UMKM Kutai Kartanegara
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
