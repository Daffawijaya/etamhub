import Link from "next/link";
import umkms from "@/data/umkm.json";

export default function LatestUmkm() {
  const latest = [...umkms]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-[#181818]">
      <h2 className="mb-1 text-xl font-semibold text-black dark:text-white">
        UMKM Terbaru
      </h2>

      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        5 data UMKM terakhir yang ditambahkan
      </p>

      <div className="space-y-3">
        {latest.map((umkm) => (
          <Link
            key={umkm.id}
            href={`/umkm/${umkm.id}`}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-black/5
              p-4
              transition
              hover:bg-neutral-50
              dark:border-white/10
              dark:hover:bg-white/5
            "
          >
            <div>
              <h3 className="font-medium text-black dark:text-white">
                {umkm.nama}
              </h3>

              <p className="text-sm text-neutral-500">{umkm.kecamatan}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-neutral-500">
                {new Date(umkm.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
