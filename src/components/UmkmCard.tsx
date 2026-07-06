import Image from "next/image";
import Link from "next/link";

type Props = {
  nama: string;
  kategori: string;
  gambar: string;
  slug: string;
};

export default function UmkmCard({ nama, kategori, gambar, slug }: Props) {
  return (
    <Link href={`/umkm/${slug}`}>
      <div className="group w-full max-w-[200px] h-max flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
        {/* IMAGE */}
        <div className="relative h-40 w-full overflow-hidden shrink-0">
          <Image
            src={gambar}
            alt={nama}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-2">
          <span className="inline-block w-fit text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {kategori}
          </span>

          <h2 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
            {nama}
          </h2>
        </div>
      </div>
    </Link>
  );
}
