"use client";

import Image from "next/image";

type Props = {
  nama: string;
  pemilik: string;
  kategori: string;
  kecamatan: string;
  alamat: string;
  deskripsi: string;
  gambar: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  lat: number;
  lng: number;
};

export default function UmkmDetail({
  nama,
  pemilik,
  kategori,
  kecamatan,
  alamat,
  deskripsi,
  gambar,
  instagram,
  facebook,
  whatsapp,
  lat,
  lng,
}: Props) {
  const whatsappNumber = whatsapp?.replace(/\D/g, "").replace(/^0/, "62");

  const displayWhatsapp = whatsappNumber
    ? whatsappNumber.replace(/^62/, "0")
    : "";

  return (
    <div className="w-full py-10 bg-white">
      <div className="grid lg:grid-cols-[320px_1fr_280px] gap-12 max-w-7xl mx-auto px-6">
        {/* FOTO */}
        <div className="relative h-[350px] lg:h-[420px] overflow-hidden rounded-xl border border-slate-200">
          <Image src={gambar} alt={nama} fill className="object-cover" />
        </div>

        {/* INFORMASI */}
        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
            {kategori}
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900">
            {nama}
          </h1>

          <p className="mt-2 text-sm text-slate-500">{kecamatan}</p>

          <div className="my-5 h-px bg-slate-200" />

          <div>
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              Deskripsi Usaha
            </h2>

            <p className="text-sm leading-7 text-slate-600">{deskripsi}</p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-4">
          {/* CARD ALAMAT */}
          <div
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                "_blank",
              )
            }
            className="cursor-pointer rounded-xl bg-[linear-gradient(135deg,_#184caf,_#844ec0,_#ca3785)] p-4 text-white transition hover:scale-[1.02]"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-purple-50">
              Lokasi Usaha
            </p>

            <h3 className="mt-2 text-base font-bold">Alamat</h3>

            <p className="mt-3 text-sm leading-6 text-purple-50">{alamat}</p>
          </div>

          {/* CARD PEMILIK */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              Informasi Pemilik
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Nama Pemilik</p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {pemilik}
                </p>
              </div>

              {displayWhatsapp && (
                <div>
                  <p className="text-xs text-slate-500">Nomor Handphone</p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {displayWhatsapp}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {whatsappNumber && (
                <button
                  onClick={() =>
                    window.open(`https://wa.me/${whatsappNumber}`, "_blank")
                  }
                  className="w-full cursor-pointer rounded-lg border border-[#25D366] bg-white px-4 py-2.5 text-sm font-medium text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
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
                  className="w-full cursor-pointer rounded-lg border border-[#DD2A7B] bg-white px-4 py-2.5 text-sm font-medium text-[#DD2A7B] transition-all hover:bg-[#DD2A7B] hover:text-white"
                >
                  Kunjungi Instagram
                </button>
              )}

              {facebook?.trim() && (
                <button
                  onClick={() =>
                    window.open(`https://facebook.com/${facebook}`, "_blank")
                  }
                  className="w-full cursor-pointer rounded-lg border border-[#1877F2] bg-white px-4 py-2.5 text-sm font-medium text-[#1877F2] transition-all hover:bg-[#1877F2] hover:text-white"
                >
                  Kunjungi Facebook
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
