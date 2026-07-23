"use client";

import Image from "next/image";
import UmkmRowActions from "./UmkmRowActions";
import { getUmkmImage } from "@/lib/getUmkmImage";
import type { Umkm } from "@/data/umkm";

interface UmkmTableProps {
  data: Umkm[];
  columns?: UmkmTableColumns;
  onEdit?: (item: Umkm) => void;
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

const getCategoryStyle = (kategori: string) => {
  switch (kategori) {
    case "Perdagangan":
      return `
        bg-blue-50 
        text-blue-700
        dark:bg-blue-500/20
        dark:text-blue-300
      `;

    case "Jasa":
      return `
        bg-purple-50 
        text-purple-700
        dark:bg-purple-500/20
        dark:text-purple-300
      `;

    case "Industri":
      return `
        bg-orange-50 
        text-orange-700
        dark:bg-orange-500/20
        dark:text-orange-300
      `;

    default:
      return `
        bg-slate-100 
        text-slate-700
        dark:bg-white/10
        dark:text-slate-300
      `;
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
  onEdit,
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
          className={`
            flex
            items-center
            gap-4
            px-6
            py-2.5
            transition-colors
            duration-300
            ${
              index !== data.length - 1
                ? "border-b border-slate-100 dark:border-white/10"
                : ""
            }
          `}
        >
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

          {columns.nama && (
            <div className="min-w-0 flex-1">
              <h4
                className="
                  truncate
                  text-[17px]
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {item.nama}
              </h4>

              <p
                className="
                  truncate
                  text-sm
                  text-slate-400
                  dark:text-slate-500
                "
              >
                {item.subkategori || "Belum ada subkategori"}
              </p>
            </div>
          )}

          {columns.pemilik && (
            <div className="w-[150px] flex-shrink-0">
              <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                {item.pemilik || "-"}
              </p>
            </div>
          )}

          {columns.whatsapp && (
            <div className="w-[130px] flex-shrink-0">
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {item.whatsapp || "-"}
              </p>
            </div>
          )}

          {columns.kategori && (
            <div className="w-[120px] flex-shrink-0">
              <span
                className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  ${getCategoryStyle(item.kategori)}
                `}
              >
                {item.kategori}
              </span>
            </div>
          )}

          {columns.kecamatan && (
            <div className="w-[120px] flex-shrink-0">
              <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                {item.kecamatan}
              </p>
            </div>
          )}

          {columns.createdAt && (
            <div className="w-[100px] flex-shrink-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatDate(item.created_at)}
              </p>
            </div>
          )}

          {columns.action && <UmkmRowActions id={item.id} />}
        </div>
      ))}
    </>
  );
}
