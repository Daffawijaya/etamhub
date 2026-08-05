"use client";

import Image from "next/image";
import RequestDetail from "./RequestDetail";
import {
  formatAction,
  formatDate,
  formatStatus,
  getActionStyle,
  getStatusStyle,
  type RequestAction,
  type RequestStatus,
} from "@/lib/request";
import { getUmkmImage } from "@/lib/getUmkmImage";

export type RequestItem = {
  id: string;
  action: RequestAction;
  status: RequestStatus;
  payload: Record<string, any>;
  created_at: string;
  umkm: {
    id: string;
    nama: string;
    kategori: string;
    kecamatan: string;
    gambar: string[];
  } | null;
  creator: {
    name: string;
    email: string;
  } | null;
};

type Props = {
  item: RequestItem;
  onUpdate: (id: string, action: "approve" | "reject") => void;
};

export default function RequestRow({ item, onUpdate }: Props) {
  const isPending = item.status === "pending";

  return (
    <div>
      <div className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50/70 dark:hover:bg-neutral-900/40 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <Image
              src={getUmkmImage(item.umkm?.gambar)}
              alt={item.umkm?.nama ?? "UMKM"}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg border border-gray-200 object-cover dark:border-neutral-700"
            />

            <div className="min-w-0">
              <h2 className="truncate font-semibold text-gray-900 dark:text-white">
                {item.umkm?.nama ?? "-"}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{item.umkm?.kategori ?? "-"}</span>

                <span>•</span>

                <span>{item.umkm?.kecamatan ?? "-"}</span>

                <span>•</span>

                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${getActionStyle(
              item.action,
            )}`}
          >
            {formatAction(item.action)}
          </span>

          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${getStatusStyle(
              item.status,
            )}`}
          >
            {formatStatus(item.status)}
          </span>

          {isPending && (
            <>
              <button
                onClick={() => onUpdate(item.id, "approve")}
                className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Setujui
              </button>

              <button
                onClick={() => onUpdate(item.id, "reject")}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
              >
                Tolak
              </button>
            </>
          )}
        </div>
      </div>

      {item.action === "update" && <RequestDetail item={item} />}

      {item.action === "delete" && isPending && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-400">
            Request penghapusan menunggu persetujuan admin.
          </p>
        </div>
      )}
    </div>
  );
}
