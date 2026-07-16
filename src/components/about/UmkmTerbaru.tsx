import Image from "next/image";
import Link from "next/link";
import { umkms } from "@/data/umkm";
import { imageUrl } from "@/lib/imageUrl";
import SectionHeader from "../textBlock/SectionHeader";

export default function UmkmTerbaruSection() {
  const latestUmkms = [...umkms].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <section className="bg-dark py-8 sm:py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
        <SectionHeader
          title="UMKM Terbaru"
          description="Pelaku usaha yang baru bergabung dan memperkenalkan produk serta layanannya melalui EtamHub."
        />

        <div
          className="
            mt-10
            sm:mt-12
            md:mt-20
            grid
            grid-cols-2
            xl:grid-cols-4
            gap-3
            sm:gap-5
            md:gap-6
          "
        >
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
              {/* Image */}
              <div
                className="
                  relative
                  aspect-[4/3]
                  overflow-hidden
                  bg-zinc-900
                "
              >
                <Image
                  src={imageUrl(umkm.gambar?.[0])}
                  alt={umkm.nama}
                  fill
                  sizes="
                    (max-width:768px) 50vw,
                    (max-width:1200px) 50vw,
                    25vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div
                className="
                  flex
                  flex-col
                  flex-1
                  p-3
                  sm:p-5
                  md:p-6
                "
              >
                <div
                  className="
                    text-[9px]
                    sm:text-xs
                    uppercase
                    tracking-wider
                    text-zinc-500
                  "
                >
                  {umkm.kecamatan}
                </div>

                <h3
                  className="
                    mt-2
                    sm:mt-3
                    text-sm
                    sm:text-lg
                    md:text-xl
                    font-semibold
                    leading-tight
                    text-white
                    line-clamp-3
                  "
                >
                  {umkm.nama}
                </h3>

                <p
                  className="
                    mt-2
                    sm:mt-3
                    text-[11px]
                    sm:text-sm
                    text-zinc-400
                  "
                >
                  {umkm.subkategori}
                </p>

                <p
                  className="
                    mt-3
                    sm:mt-4
                    text-[11px]
                    sm:text-sm
                    leading-relaxed
                    text-zinc-500
                    line-clamp-2
                  "
                >
                  {umkm.deskripsi}
                </p>

                <div className="mt-auto pt-4 sm:pt-8">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      sm:gap-2
                      text-[11px]
                      sm:text-sm
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
