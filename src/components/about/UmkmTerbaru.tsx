import Image from "next/image";
import Link from "next/link";
import { umkms } from "@/data/umkm";
import { imageUrl } from "@/lib/imageUrl";
import SectionHeader from "../textBlock/SectionHeader";

export default function UmkmTerbaruSection() {
  const latestUmkms = [...umkms].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title="UMKM Terbaru"
          description="Pelaku usaha yang baru bergabung dan memperkenalkan produk serta layanannya melalui EtamHub."
        />

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {latestUmkms.map((umkm) => (
            <Link
              key={`${umkm.id}-${umkm.nama}`}
              href={`/umkm/${umkm.id}`}
              className="
                group
                flex
                flex-col
                overflow-hidden
                bg-[#1b1b1b]
                border
                border-zinc-800
                hover:border-zinc-700
                transition-all
                duration-300
              "
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                <Image
                  src={imageUrl(umkm.gambar?.[0])}
                  alt={umkm.nama}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="text-xs uppercase tracking-wider text-zinc-500">
                  {umkm.kecamatan}
                </div>

                <h3 className="mt-3 text-xl font-semibold leading-tight text-white line-clamp-3">
                  {umkm.nama}
                </h3>

                <p className="mt-3 text-sm text-zinc-400">{umkm.subkategori}</p>

                <p className="mt-4 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                  {umkm.deskripsi}
                </p>

                <div className="mt-auto pt-8">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      text-white
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    Lihat Detail
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
