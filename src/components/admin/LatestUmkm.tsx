import UmkmTable from "./UmkmTable";
import { getBaseUrl } from "@/lib/api";

export default async function LatestUmkm() {
  const res = await fetch(`${getBaseUrl()}/api/umkm`);

  if (!res.ok) {
    throw new Error("Gagal mengambil data UMKM");
  }

  const umkms = await res.json();

  const latest = [...umkms]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div
      className="
        overflow-hidden 
        rounded-2xl 
        bg-white
        dark:bg-dark-card
        transition-colors
        duration-300
      "
    >
      <div className="p-6">
        <h2
          className="
            text-lg 
            font-semibold 
            text-slate-900
            dark:text-white
            transition-colors
            duration-300
          "
        >
          UMKM Terbaru
        </h2>

        <p
          className="
            mt-1 
            text-sm 
            text-slate-500
            dark:text-slate-400
            transition-colors
            duration-300
          "
        >
          5 UMKM yang terakhir ditambahkan ke EtamHub
        </p>
      </div>

      <div className="pb-3">
        <UmkmTable
          data={latest}
          columns={{
            gambar: true,
            nama: true,
            kategori: true,
            kecamatan: true,
            createdAt: true,
            action: true,
          }}
        />
      </div>
    </div>
  );
}
