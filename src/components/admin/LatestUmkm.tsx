import umkms from "@/data/umkm.json";

import UmkmTable from "./UmkmTable";

export default function LatestUmkm() {
  const latest = [...umkms]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">UMKM Terbaru</h2>

        <p className="mt-1 text-sm text-slate-500">
          5 UMKM yang terakhir ditambahkan ke EtamHub
        </p>
      </div>

      <div className="pb-3">
        <UmkmTable data={latest} />
      </div>
    </div>
  );
}
