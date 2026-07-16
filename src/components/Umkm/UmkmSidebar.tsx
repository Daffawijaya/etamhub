"use client";

type Props = {
  pemilik: string;
  alamat: string;
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  lat: number;
  lng: number;
};

export default function UmkmSidebar({
  pemilik,
  alamat,
  whatsapp,
  instagram,
  tiktok,
  facebook,
  lat,
  lng,
}: Props) {
  const whatsappNumber = whatsapp?.replace(/\D/g, "").replace(/^0/, "62");

  const getFacebookUrl = (facebook?: string) => {
    if (!facebook) return "#";

    const value = facebook.trim();

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    if (
      value.startsWith("facebook.com") ||
      value.startsWith("www.facebook.com") ||
      value.startsWith("web.facebook.com")
    ) {
      return `https://${value}`;
    }

    return `https://facebook.com/${value}`;
  };

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#161616]
        p-5
      "
    >
      {/* Glow */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_45%)]
          pointer-events-none
        "
      />

      <div className="relative z-10">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-zinc-500">
          Detail
        </p>

        <h3 className="text-xl font-semibold text-white">Informasi UMKM</h3>

        <div className="mt-6 space-y-5">
          {/* Owner */}
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Pemilik
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-white">
              {pemilik}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Alamat
            </p>

            <p className="mt-1 text-sm leading-6 capitalize text-zinc-400">
              {alamat}
            </p>
          </div>
        </div>

        {/* Location */}
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
              "_blank",
            )
          }
          className="
            mt-6
            w-full
            rounded-xl
            border
            border-violet-500/20
            bg-violet-500/10
            px-4
            py-3
            text-sm
            font-medium
            text-violet-300
            transition-all
            duration-300
            hover:bg-violet-500/15
            hover:text-white
          "
        >
          Lihat Lokasi
        </button>

        {(whatsappNumber ||
          instagram?.trim() ||
          facebook?.trim() ||
          tiktok?.trim()) && (
          <div className="mt-6 border-t border-white/10 pt-5">
            <h4 className="text-sm font-semibold text-white">Hubungi UMKM</h4>

            <div className="mt-4 flex flex-col gap-2">
              {whatsappNumber && (
                <button
                  onClick={() =>
                    window.open(`https://wa.me/${whatsappNumber}`, "_blank")
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-violet-500/20
                    bg-violet-500/10
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-violet-300
                    transition-all
                    duration-300
                    hover:bg-violet-500/15
                    hover:text-white
                  "
                >
                  Chat WhatsApp
                </button>
              )}

              {instagram?.trim() && (
                <button
                  onClick={() =>
                    window.open(
                      `https://instagram.com/${instagram.replace("@", "")}`,
                      "_blank",
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-zinc-300
                    transition-all
                    duration-300
                    hover:border-violet-500/20
                    hover:bg-violet-500/10
                    hover:text-white
                  "
                >
                  Instagram
                </button>
              )}

              {tiktok?.trim() && (
                <button
                  onClick={() =>
                    window.open(
                      `https://www.tiktok.com/${
                        tiktok.startsWith("@") ? tiktok : `@${tiktok}`
                      }`,
                      "_blank",
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-zinc-300
                    transition-all
                    duration-300
                    hover:border-violet-500/20
                    hover:bg-violet-500/10
                    hover:text-white
                  "
                >
                  TikTok
                </button>
              )}

              {facebook?.trim() && (
                <button
                  onClick={() =>
                    window.open(getFacebookUrl(facebook), "_blank")
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-zinc-300
                    transition-all
                    duration-300
                    hover:border-violet-500/20
                    hover:bg-violet-500/10
                    hover:text-white
                  "
                >
                  Facebook
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
