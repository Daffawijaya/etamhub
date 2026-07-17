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
      className={`
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        p-4
        backdrop-blur-sm
        transition-all
        duration-300
        ${
          open
            ? "pointer-events-auto bg-black/70 opacity-100"
            : "pointer-events-none bg-black/0 opacity-0"
        }
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          group
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-white
          bg-light-bg
          dark:border-white/10
          dark:bg-[#161616]
          transition-all
          duration-300
          ${
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-4 scale-95 opacity-0"
          }
        `}
      >
        {/* Glow */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_45%)]
            pointer-events-none
          "
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-white
            bg-white/40
            text-zinc-700
            transition-all
            duration-300
            hover:border-white
            hover:bg-white/60
            hover:text-black
            dark:border-white/10
            dark:bg-white/[0.03]
            dark:text-zinc-400
            dark:hover:border-violet-500/20
            dark:hover:bg-violet-500/10
            dark:hover:text-white
          "
        >
          <svg
            className="h-5 w-5"
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

        <div className="relative z-10 p-8">
          <div className="text-center">
            <p className="mb-3 text-xs tracking-[0.25em] text-zinc-600 dark:text-zinc-500">
              etamhub.
            </p>

            <h2 className="text-3xl font-semibold text-black dark:text-white">
              Pendaftaran UMKM
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Scan QR Code atau klik tombol di bawah untuk mengakses formulir
              pendaftaran UMKM etamhub.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <div
              className="
                rounded-3xl
                border
                border-white
                bg-white
                p-5
                dark:border-white/10
              "
            >
              <QRCode value={formLink} size={220} />
            </div>
          </div>

          <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-8
              flex
              items-center
              justify-center
              rounded-xl
              border
              border-white
              bg-white/50
              px-5
              py-3
              font-medium
              text-black
              transition-all
              duration-300
              hover:border-white
              hover:bg-white/70
              dark:border-violet-500/20
              dark:bg-violet-500/10
              dark:text-violet-300
              dark:hover:bg-violet-500/15
              dark:hover:text-white
            "
          >
            Isi Formulir Sekarang
          </a>

          <p className="mt-5 text-center text-xs text-zinc-600 dark:text-zinc-500">
            Direktori UMKM Kutai Kartanegara
          </p>
        </div>

        {/* Bottom Accent */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-px
            w-full
            bg-gradient-to-r
            from-violet-500
            via-fuchsia-400
            to-transparent
          "
        />
      </div>
    </div>
  );
}
