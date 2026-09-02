"use client";

import Image from "next/image";
import UmkmRowActions from "./UmkmRowActions";
import { getUmkmImage } from "@/lib/getUmkmImage";
import type { Umkm } from "@/data/umkm";

interface UmkmTableProps {
  data?: Umkm[];
  columns?: UmkmTableColumns;
  onStatusChanged?: () => void;
  showPublishAction?: boolean;
}

interface UmkmTableColumns {
  gambar?: boolean;
  nama?: boolean;
  pemilik?: boolean;
  whatsapp?: boolean;
  kategori?: boolean;
  kecamatan?: boolean;
  createdAt?: boolean;
  status?: boolean;
  action?: boolean;
}

const getCategoryStyle = (kategori: string | null) => {
  switch (kategori) {
    case "Perdagangan":
      return `
        bg-green-50 
        text-green-700
        dark:bg-green-500/20
        dark:text-green-300
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

const getStatusStyle = (published: boolean | null) => {
  return published
    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
    : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400";
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
  data = [],
  columns = {
    gambar: true,
    nama: true,
    pemilik: true,
    whatsapp: true,
    kategori: true,
    kecamatan: true,
    createdAt: true,
    status: true,
    action: true,
  },
  onStatusChanged,
  showPublishAction = true,
}: UmkmTableProps) {
  return (
    <>
      {data.map((item, index) => (
        <div
          key={item.id}
          className={`
            flex
            items-center
            gap-3 sm:gap-4
            px-4 sm:px-6
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
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-xl">
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
                  capitalize
                  text-sm sm:text-[17px]
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
            <div className="hidden w-[150px] flex-shrink-0 sm:block">
              <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                {item.pemilik || "-"}
              </p>
            </div>
          )}

          {columns.whatsapp && (
            <div className="hidden w-[130px] flex-shrink-0 md:block">
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {item.whatsapp || "-"}
              </p>
            </div>
          )}

          {columns.kategori && (
            <div className="hidden sm:block w-[80px] flex-shrink-0 sm:w-[120px]">
              <span
                className={`
                  inline-flex
                  rounded-lg
                  px-2
                  py-0.5
                  text-[11px]
                  font-medium
                  ${getCategoryStyle(item.kategori)}
                `}
              >
                {item.kategori}
              </span>
            </div>
          )}

          {columns.kecamatan && (
            <div className="hidden w-[120px] flex-shrink-0 md:block">
              <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                {item.kecamatan}
              </p>
            </div>
          )}

          {columns.status && (
            <div className="w-[70px] sm:w-[110px] flex-shrink-0">
              <span
                className={`inline-flex rounded-lg px-2 py-0.5 text-[11px] font-medium ${getStatusStyle(item.published)}`}
              >
                {item.published ? "Publik" : "Privat"}
              </span>
            </div>
          )}

          {columns.createdAt && (
            <div className="hidden w-[100px] flex-shrink-0 sm:block">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatDate(item.created_at)}
              </p>
            </div>
          )}

          {columns.action && (
            <UmkmRowActions
              id={item.id}
              published={item.published}
              onStatusChanged={onStatusChanged}
              showPublishAction={showPublishAction}
            />
          )}
        </div>
      ))}
    </>
  );
}
