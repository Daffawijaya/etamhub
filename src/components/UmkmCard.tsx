import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";

type Props = {
  id: number;
  nama: string;
  kategori: string;
  gambar: string[];
};

export default function UmkmCard({ id, nama, kategori, gambar }: Props) {
  return (
    <Link href={`/umkm/${id}`} className="block h-full">
      <article className="group h-full bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Image Section */}
        <div className="p-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Image
              src={imageUrl(gambar[0])}
              alt={nama}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 pb-5 flex flex-col">
          <p className="text-xs text-slate-500 mb-3">{kategori}</p>

          <h2 className="text-lg leading-[1.15] font-bold text-slate-900 line-clamp-3 max-h-[70px]">
            {nama}
          </h2>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Lihat Detail
            </span>

            <svg
              className="w-5 h-5 text-blue-700 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
