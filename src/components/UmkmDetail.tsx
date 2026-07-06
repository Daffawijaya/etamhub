import Image from "next/image";

type Props = {
  nama: string;
  kategori: string;
  kecamatan: string;
  alamat: string;
  telepon: string;
  deskripsi: string;
  gambar: string;
  instagram: string;
  whatsapp: string;
};

export default function UmkmDetail({
  nama,
  kategori,
  kecamatan,
  alamat,
  telepon,
  deskripsi,
  gambar,
  instagram,
  whatsapp,
}: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* FOTO */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
        <Image src={gambar} alt={nama} fill className="object-cover" />
      </div>

      {/* DETAIL */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sm">
          {kategori}
        </span>

        <h1 className="mt-4 text-4xl font-bold">{nama}</h1>

        <p className="mt-2 text-slate-500">{kecamatan}</p>

        <p className="mt-6 text-slate-700 leading-relaxed">{deskripsi}</p>

        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-semibold">Alamat</h3>
            <p className="text-slate-600">{alamat}</p>
          </div>

          <div>
            <h3 className="font-semibold">Telepon</h3>
            <p className="text-slate-600">{telepon}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-green-600 text-white"
          >
            WhatsApp
          </a>

          <a
            href={`https://instagram.com/${instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-pink-600 text-white"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
