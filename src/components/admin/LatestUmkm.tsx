import Image from "next/image";
import umkms from "@/data/umkm.json";
import { MoreHorizontal } from "lucide-react";

export default function LatestUmkm() {
  const latest = [...umkms].reverse().slice(0, 5);

  return (
    <div className="rounded-[32px] bg-transparent">
      <div className="mb-6 flex gap-8">
        <button className="border-b-2 border-slate-900 pb-2 font-semibold">
          UMKM Terbaru
        </button>

        <button className="pb-2 text-slate-400">Semua</button>
      </div>

      <div className="space-y-4">
        {latest.map((item) => (
          <div
            key={item.id}
            className="flex items-center rounded-3xl bg-white px-5 py-4 shadow-sm"
          >
            {/* Foto */}
            <div className="relative h-12 w-12 overflow-hidden rounded-xl">
              <Image
                src={item.gambar?.[0] || "/placeholder.jpg"}
                alt={item.nama}
                fill
                className="object-cover"
              />
            </div>

            {/* Nama */}
            <div className="ml-4 flex-1">
              <h4 className="font-semibold text-slate-900">{item.nama}</h4>

              <p className="text-sm text-slate-400">UMKM #{item.id}</p>
            </div>

            {/* Kategori */}
            <div className="w-40">
              <p className="font-medium">{item.kategori}</p>
            </div>

            {/* Kecamatan */}
            <div className="w-40">
              <p className="text-slate-600">{item.kecamatan}</p>
            </div>

            {/* Status */}
            <div className="w-24">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                Aktif
              </span>
            </div>

            {/* Action */}
            <button className="ml-4">
              <MoreHorizontal size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
