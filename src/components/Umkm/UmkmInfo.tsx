type Props = {
  nama: string;
  kategori: string;
  kecamatan: string;
  deskripsi: string;
};

export default function UmkmInfo({
  nama,
  kategori,
  kecamatan,
  deskripsi,
}: Props) {
  return (
    <div className="flex flex-col">
      <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
        {kategori}
      </span>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        {nama}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        {kecamatan}
      </p>

      <div className="my-5 h-px bg-slate-200" />

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Deskripsi Usaha
        </h2>

        <p className="text-sm leading-7 text-slate-600">
          {deskripsi}
        </p>
      </div>
    </div>
  );
}