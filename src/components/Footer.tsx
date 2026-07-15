"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-dark text-white border-t border-white/5">
      {/* Glow Atas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[1200px] h-[500px] rounded-full bg-white/[0.03] blur-[180px]" />

        <div className="absolute top-24 left-[-200px] w-[500px] h-[500px] rounded-full bg-slate-300/[0.03] blur-[180px]" />

        <div className="absolute top-24 right-[-200px] w-[500px] h-[500px] rounded-full bg-slate-300/[0.03] blur-[180px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 z-20">
        {/* Heading */}
        <div className="py-12 md:py-16 text-center">
          <h2 className="text-4xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.5]">
            Temukan UMKM Lokal
            <br />
            Kutai Kartanegara
          </h2>
        </div>

        {/* Divider */}
        <div
          className="w-full"
          style={{
            height: "0.5px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
          }}
        />

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14 py-16">
          {/* Brand */}
          <div>
            <h3 className="text-4xl font-bold tracking-tight">etamhub.</h3>

            <p className="mt-8 text-white/60">Kutai Kartanegara</p>
          </div>

          {/* Menu */}
          <div>
            <p className="text-white/40 text-sm mb-5">Navigasi</p>

            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-white/80 hover:text-white transition"
              >
                Beranda
              </Link>

              <Link
                href="/about"
                className="text-white/80 hover:text-white transition"
              >
                Tentang
              </Link>

              <Link
                href="/kontak"
                className="text-white/80 hover:text-white transition"
              >
                Kontak
              </Link>
            </div>
          </div>

          {/* UMKM */}
          <div>
            <p className="text-white/40 text-sm mb-5">Eksplorasi</p>

            <div className="flex flex-col gap-4">
              <Link
                href="/umkm"
                className="text-white/80 hover:text-white transition"
              >
                Semua UMKM
              </Link>

              <Link
                href="/kecamatan"
                className="text-white/80 hover:text-white transition"
              >
                Kecamatan
              </Link>

              <Link
                href="/kategori"
                className="text-white/80 hover:text-white transition"
              >
                Kategori
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/40 text-sm mb-5">Dukungan</p>

            <div className="space-y-4">
              <p className="text-white/80">Dinas Koperasi & UMKM</p>

              <p className="text-white/50">Kutai Kartanegara</p>

              <p className="text-white font-medium">etamhub@kukarkab.go.id</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} EtamHub
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-white/40 hover:text-white transition"
            >
              Sitemap
            </Link>

            <Link
              href="#"
              className="text-white/40 hover:text-white transition"
            >
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>

      {/* Glow bawah */}
      <div
        className="
    absolute
    inset-x-0
    bottom-0
    h-[300px]
    pointer-events-none
  "
        style={{
          background:
            "linear-gradient(to top, #121313 0%, rgba(18,19,19,0.9) 20%, rgba(18,19,19,0.5) 50%, rgba(18,19,19,0) 100%)",
        }}
      />
    </footer>
  );
}
