import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { getUmkmImage } from "@/lib/getUmkmImage";

interface Umkm {
  id: number | string;
  nama: string;
  pemilik?: string;
  whatsapp?: string;
  gambar: string | string[];
  subkategori?: string;
  kategori: string;
  kecamatan: string;
  createdAt: string;
}

interface UmkmTableColumns {
  gambar?: boolean;
  nama?: boolean;
  pemilik?: boolean;
  whatsapp?: boolean;
  kategori?: boolean;
  kecamatan?: boolean;
  createdAt?: boolean;
  action?: boolean;
}

interface UmkmTableProps {
  data: Umkm[];
  columns?: UmkmTableColumns;
}

const getCategoryStyle = (kategori: string) => {
  switch (kategori) {
    case "Perdagangan":
      return "bg-blue-50 text-blue-700";

    case "Jasa":
      return "bg-purple-50 text-purple-700";

    case "Industri":
      return "bg-orange-50 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function UmkmTable({
  data,
  columns = {
    gambar: true,
    nama: true,
    pemilik: true,
    whatsapp: true,
    kategori: true,
    kecamatan: true,
    createdAt: true,
    action: true,
  },
}: UmkmTableProps) {
  return (
    <>
      {data.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center gap-4 px-6 py-2.5 ${
            index !== data.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          {/* Gambar */}
          {columns.gambar && (
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src={getUmkmImage(item.gambar)}
                alt={item.nama}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Nama */}
          {columns.nama && (
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-[17px] font-semibold text-slate-900">
                {item.nama}
              </h4>

              <p className="truncate text-sm text-slate-400">
                {item.subkategori || "Belum ada subkategori"}
              </p>
            </div>
          )}

          {/* Pemilik */}
          {columns.pemilik && (
            <div className="w-[150px] flex-shrink-0">
              <p className="truncate font-medium text-slate-700">
                {item.pemilik || "-"}
              </p>
            </div>
          )}

          {/* WhatsApp */}
          {columns.whatsapp && (
            <div className="w-[130px] flex-shrink-0">
              <p className="truncate text-sm text-slate-500">
                {item.whatsapp || "-"}
              </p>
            </div>
          )}

          {/* Kategori */}
          {columns.kategori && (
            <div className="w-[120px] flex-shrink-0">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${getCategoryStyle(
                  item.kategori,
                )}`}
              >
                {item.kategori}
              </span>
            </div>
          )}

          {/* Kecamatan */}
          {columns.kecamatan && (
            <div className="w-[120px] flex-shrink-0">
              <p className="truncate font-medium text-slate-700">
                {item.kecamatan}
              </p>
            </div>
          )}

          {/* Tanggal */}
          {columns.createdAt && (
            <div className="w-[100px] flex-shrink-0">
              <p className="text-sm text-slate-500">
                {formatDate(item.createdAt)}
              </p>
            </div>
          )}

          {/* Action */}
          {columns.action && (
            <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition hover:bg-slate-100">
              <MoreHorizontal size={18} />
            </button>
          )}
        </div>
      ))}
    </>
  );
}
