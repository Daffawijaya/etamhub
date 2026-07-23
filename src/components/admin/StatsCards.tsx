import { MapPinned, Store, Tags } from "lucide-react";
import type { Umkm } from "@/data/umkm";

interface Props {
  umkms: Umkm[];
}

export default function StatsCards({ umkms }: Props) {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  const totalSubkategori = new Set(umkms.map((item) => item.subkategori)).size;

  return (
    <div
      className="
    relative overflow-hidden rounded-2xl p-8 text-white
    bg-gradient-to-br

    from-[#ff7a59]
    via-[#ff6b7d]
    to-[#ff4fa3]

    dark:from-[#1b1027]
    dark:via-[#21152f]
    dark:to-[#130f1d]

    transition-all
    duration-500
    ease-in-out
  "
    >
      {/* glow */}
      <div
        className="
          absolute -right-16 -top-16
          h-48 w-48 rounded-full
          bg-white/10 blur-2xl

          dark:bg-[#ff4fa3]/20
        "
      />

      <div
        className="
          absolute -bottom-20 -left-10
          h-48 w-48 rounded-full
          bg-white/10 blur-2xl

          dark:bg-[#1184CA]/20
        "
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className="
              rounded-2xl bg-white/20 p-3
              backdrop-blur-md

              dark:bg-white/10
            "
          >
            <Store size={24} />
          </div>

          <div className="text-right">
            <p className="text-white/70">Total UMKM</p>

            <h2 className="text-6xl font-bold leading-none">
              {totalUmkm.toLocaleString("id-ID")}
            </h2>

            <p className="mt-1 text-white/70">Terdaftar di etamhub.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div
            className="
              rounded-2xl bg-white/10 p-4
              backdrop-blur-sm

              dark:bg-white/5
              dark:border dark:border-white/10
            "
          >
            <div className="mb-2 flex items-center gap-2">
              <MapPinned size={16} />

              <span className="text-sm text-white/80">Kecamatan</span>
            </div>

            <p className="text-2xl font-bold">{totalKecamatan}</p>
          </div>

          <div
            className="
              rounded-2xl bg-white/10 p-4
              backdrop-blur-sm

              dark:bg-white/5
              dark:border dark:border-white/10
            "
          >
            <div className="mb-2 flex items-center gap-2">
              <Tags size={16} />

              <span className="text-sm text-white/80">Subkategori</span>
            </div>

            <p className="text-2xl font-bold">{totalSubkategori}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
