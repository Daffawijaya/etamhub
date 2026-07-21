import umkms from "@/data/umkm.json";
import {
  ArrowUpRight,
  MapPinned,
  Store,
  Tags,
} from "lucide-react";

export default function StatsCards() {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(
    umkms.map((item) => item.kecamatan)
  ).size;

  const totalSubkategori = new Set(
    umkms.map((item) => item.subkategori)
  ).size;

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#ff7a59] via-[#ff6b7d] to-[#ff4fa3] p-8 text-white shadow-xl">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="rounded-2xl bg-white/20 p-3">
            <Store size={24} />
          </div>

          <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm">
            Live
            <ArrowUpRight size={14} />
          </div>
        </div>

        <p className="mt-8 text-white/80">
          Total UMKM
        </p>

        <h2 className="mt-2 text-6xl font-bold">
          {totalUmkm.toLocaleString("id-ID")}
        </h2>

        <p className="mt-2 text-white/80">
          Terdaftar di EtamHub
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <MapPinned size={16} />
              <span className="text-sm text-white/80">
                Kecamatan
              </span>
            </div>

            <p className="text-2xl font-bold">
              {totalKecamatan}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <Tags size={16} />
              <span className="text-sm text-white/80">
                Subkategori
              </span>
            </div>

            <p className="text-2xl font-bold">
              {totalSubkategori}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}