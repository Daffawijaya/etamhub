"use client";

import QRCode from "react-qr-code";

interface DaftarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DaftarModal({ open, onClose }: DaftarModalProps) {
  const formLink =
    "https://docs.google.com/forms/d/e/1FAIpQLSflE8BKOb8BeDTE2hqRDuU_qL-83UAj6uxNdby6Km8zHS7tBQ/viewform?usp=header";

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        open
          ? "pointer-events-auto bg-black/60 opacity-100"
          : "pointer-events-none bg-black/0 opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          open
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-700"
        >
          <svg
            className="h-6 w-6"
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
        </button>

        <div className="p-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Pendaftaran UMKM
          </h2>

          <p className="mt-3 text-center text-slate-600">
            Scan QR Code atau klik tombol di bawah untuk mengakses formulir
            pendaftaran UMKM EtamHub.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <QRCode value={formLink} size={220} />
            </div>
          </div>

          <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:scale-[1.02] hover:opacity-90"
          >
            Isi Formulir Sekarang
          </a>

          <p className="mt-4 text-center text-xs text-slate-500">
            Direktori UMKM Kutai Kartanegara
          </p>
        </div>
      </div>
    </div>
  );
}
