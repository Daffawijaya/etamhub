import Image from "next/image";
import Link from "next/link";

type Props = {
  nama: string;
  kategori: string;
  gambar: string;
  slug: string;
};

export default function UmkmCard({
  nama,
  kategori,
  gambar,
  slug,
}: Props) {
  const categoryColor = {
    Perdagangan: "bg-blue-100 text-blue-700",
    Jasa: "bg-purple-100 text-purple-700",
    Industri: "bg-emerald-100 text-emerald-700",
  };

  const badgeColor =
    categoryColor[kategori as keyof typeof categoryColor] ||
    "bg-slate-100 text-slate-600";

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
          <span
            className={`inline-block w-fit text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}
          >
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