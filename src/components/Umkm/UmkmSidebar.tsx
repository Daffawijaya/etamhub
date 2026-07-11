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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-900">Informasi UMKM</h3>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Pemilik
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">
            {pemilik}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Alamat
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600 capitalize">
            {alamat}
          </p>
        </div>
      </div>

      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            "_blank",
          )
        }
        className="
          mt-5
          w-full
          rounded-xl
          border
          border-slate-200
          px-4
          py-2.5
          text-sm
          font-medium
          text-slate-700
          transition
          hover:bg-slate-50
        "
      >
        Lihat Lokasi
      </button>

      {(whatsappNumber || instagram?.trim() || facebook?.trim()) && (
        <div className="mt-5 border-t border-slate-200 pt-5">
          <h4 className="text-sm font-semibold text-slate-900">Hubungi UMKM</h4>

          <div className="mt-3 flex flex-col gap-2">
            {whatsappNumber && (
              <button
                onClick={() =>
                  window.open(`https://wa.me/${whatsappNumber}`, "_blank")
                }
                className="
                  w-full
                  rounded-xl
                  bg-primary
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-slate-800
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
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Instagram
              </button>
            )}

            {tiktok?.trim() && (
              <button
                onClick={() =>
                  window.open(
                    `https://www.tiktok.com/${tiktok.startsWith("@") ? tiktok : `@${tiktok}`}`,
                    "_blank",
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Tiktok
              </button>
            )}

            {facebook?.trim() && (
              <button
                onClick={() =>
                  window.open(`https://facebook.com/${facebook}`, "_blank")
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Facebook
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
