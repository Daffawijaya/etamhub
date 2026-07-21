import umkms from "@/data/umkm.json";

import MapClient from "@/components/map/MapClient";

export default function UmkmMapWidget() {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  return (
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-[#181818]">
      <div className="border-b border-black/5 p-6 dark:border-white/10">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Peta UMKM
        </h2>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {totalUmkm} Marker • {totalKecamatan} Kecamatan
        </p>
      </div>

      <div className="h-[550px]">
        <MapClient />
      </div>
    </section>
  );
}
