"use client";

import Image from "next/image";

type Props = {
  nama: string;
  kategori: string;
  kecamatan: string;
  alamat: string;
  telepon: string;
  deskripsi: string;
  gambar: string;
  instagram: string;
  whatsapp: string;
};

export default function UmkmDetail({
  nama,
  kategori,
  kecamatan,
  alamat,
  telepon,
  deskripsi,
  gambar,
  instagram,
  whatsapp,
}: Props) {
  return (
    <div className="w-full  py-10 bg-white">
      <div className="grid grid-cols- lg:grid-cols-[320px_1fr_280px] gap-12 max-w-7xl mx-auto px-6">
        {/* FOTO */}
        <div className="relative h-[350px] lg:h-[420px] overflow-hidden rounded-xl border border-slate-200">
          <Image src={gambar} alt={nama} fill className="object-cover" />
        </div>

        {/* INFORMASI */}
        <div className="flex flex-col ">
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
                "https://maps.google.com/?q=-0.4167,116.9833",
                "_blank",
              )
            }
            className="rounded-xl bg-[linear-gradient(135deg,_#184caf,_#844ec0,_#ca3785)] p-4 text-white cursor-pointer transition hover:scale-[1.02]"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-purple-50">
              Lokasi Usaha
            </p>

            <h3 className="mt-2 text-base font-bold">Alamat</h3>

            <p className="mt-3 text-sm leading-6 text-purple-50">{alamat}</p>
          </div>

          {/* CARD KONTAK */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Kontak UMKM</h3>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Nomor Telepon</p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {telepon}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Instagram</p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  @{instagram}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() =>
                  window.open(`https://wa.me/${whatsapp}`, "_blank")
                }
                className="w-full rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
              >
                Chat WhatsApp
              </button>

              <button
                onClick={() =>
                  window.open(`https://instagram.com/${instagram}`, "_blank")
                }
                className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 cursor-pointer bg-[linear-gradient(45deg,#F58529,#FEDA77,#DD2A7B,#8134AF,#515BD4)]"
              >
                Kunjungi Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
