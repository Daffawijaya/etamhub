import Image from "next/image";

interface TeamCardProps {
  nama: string;
  jabatan: string;
  foto: string;
  featured?: boolean;
}

export default function TeamCard({
  nama,
  jabatan,
  foto,
  featured,
}: TeamCardProps) {
  return (
    <div
      className={`group relative text-center rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        featured
          ? "bg-gradient-to-b from-primary/10 to-primary/5 ring-2 ring-primary shadow-xl"
          : "hover:bg-white"
      }`}
    >
      {featured && (
        <span className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold whitespace-nowrap">
          Developer EtamHub
        </span>
      )}

      <div className="relative h-65 flex items-end overflow-hidden">
        <Image
          src={foto}
          alt={nama}
          fill
          className="
    object-contain
    object-bottom
    origin-bottom
    transition-transform duration-500
    group-hover:scale-105
    [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]
  "
        />
      </div>

      <h3 className="font-bold text-xl text-slate-900 pt-4 transition-colors duration-300 group-hover:text-primary">
        {nama}
      </h3>

      <p className="mt-1 text-slate-600 transition-colors duration-300 group-hover:text-slate-800">
        {jabatan}
      </p>
    </div>
  );
}
