import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import umkms from "@/data/umkm.json";
import { getUmkmImage } from "@/lib/getUmkmImage";

const getCategoryStyle = (kategori: string) => {
  switch (kategori) {
    case "Perdagangan":
      return "bg-blue-50 text-blue-700";

    case "Jasa":
      return "bg-purple-50 text-purple-700";

    case "Industri":
      return "bg-orange-50 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function LatestUmkm() {
  const latest = [...umkms]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-[32px] bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">UMKM Terbaru</h2>

        <p className="mt-1 text-sm text-slate-500">
          5 UMKM yang terakhir ditambahkan ke EtamHub
        </p>
      </div>

      {/* List */}
      <div className="py-2">
        {latest.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 px-6 py-3 ${
              index !== latest.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            {/* Thumbnail */}
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src={getUmkmImage(item.gambar)}
                alt={item.nama}
                fill
                className="object-cover"
              />
            </div>

            {/* Nama + Subkategori */}
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-[17px] font-semibold text-slate-900">
                {item.nama}
              </h4>

              <p className="truncate text-sm text-slate-400">
                {item.subkategori || "Belum ada subkategori"}
              </p>
            </div>

            {/* Kategori */}
            <div className="w-[120px] flex-shrink-0">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${getCategoryStyle(
                  item.kategori,
                )}`}
              >
                {item.kategori}
              </span>
            </div>

            {/* Kecamatan */}
            <div className="w-[120px] flex-shrink-0">
              <p className="truncate font-medium text-slate-700">
                {item.kecamatan}
              </p>
            </div>

            {/* Tanggal */}
            <div className="w-[90px] flex-shrink-0">
              <p className="text-sm text-slate-500">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>

            {/* Action */}
            <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition hover:bg-slate-100">
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
