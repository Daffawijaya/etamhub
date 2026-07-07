"use client";

type Props = {
  pemilik: string;
  alamat: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  lat: number;
  lng: number;
};

export default function UmkmSidebar({
  pemilik,
  alamat,
  whatsapp,
  instagram,
  facebook,
  lat,
  lng,
}: Props) {
  const whatsappNumber = whatsapp
    ?.replace(/\D/g, "")
    .replace(/^0/, "62");

  const displayWhatsapp = whatsappNumber
    ? whatsappNumber.replace(/^62/, "0")
    : "";

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            "_blank"
          )
        }
        className="cursor-pointer rounded-xl bg-[linear-gradient(135deg,_#184caf,_#844ec0,_#ca3785)] p-4 text-white"
      >
        <p className="text-xs uppercase tracking-wider text-purple-50">
          Lokasi Usaha
        </p>

        <h3 className="mt-2 text-base font-bold">
          Alamat
        </h3>

        <p className="mt-3 text-sm leading-6 text-purple-50 capitalize">
          {alamat}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-bold">
          Informasi Pemilik
        </h3>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs text-slate-500">
              Nama Pemilik
            </p>

            <p className="mt-1 text-sm font-semibold capitalize">
              {pemilik}
            </p>
          </div>

          {displayWhatsapp && (
            <div>
              <p className="text-xs text-slate-500">
                WhatsApp
              </p>

              <p className="mt-1 text-sm font-semibold">
                {displayWhatsapp}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {whatsappNumber && (
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${whatsappNumber}`,
                  "_blank"
                )
              }
              className="rounded-lg border border-[#25D366] px-4 py-2.5 text-sm font-medium text-[#25D366]"
            >
              Chat WhatsApp
            </button>
          )}

          {instagram?.trim() && (
            <button
              onClick={() =>
                window.open(
                  `https://instagram.com/${instagram.replace("@", "")}`,
                  "_blank"
                )
              }
              className="rounded-lg border border-[#DD2A7B] px-4 py-2.5 text-sm font-medium text-[#DD2A7B]"
            >
              Kunjungi Instagram
            </button>
          )}

          {facebook?.trim() && (
            <button
              onClick={() =>
                window.open(
                  `https://facebook.com/${facebook}`,
                  "_blank"
                )
              }
              className="rounded-lg border border-[#1877F2] px-4 py-2.5 text-sm font-medium text-[#1877F2]"
            >
              Kunjungi Facebook
            </button>
          )}
        </div>
      </div>
    </div>
  );
}