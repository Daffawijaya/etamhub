"use client";

import { useState } from "react";
import Image from "next/image";
import { getUmkmImage } from "@/lib/getUmkmImage";
import { formatFieldName, formatValue, getChangedFields } from "@/lib/request";

type RequestDetailProps = {
  item: {
    payload: Record<string, any>;
  };
};

export default function RequestDetail({ item }: RequestDetailProps) {
  const [expanded, setExpanded] = useState(false);

  const before = item.payload?.before ?? {};
  const after = item.payload?.after ?? {};

  const changedFields = getChangedFields(item.payload);

  if (changedFields.length === 0) {
    return null;
  }

  return (
    <>
      <div className="border-t border-gray-100 px-5 py-3 dark:border-neutral-800">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {expanded
            ? "Sembunyikan perubahan ↑"
            : `Lihat ${changedFields.length} perubahan →`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 dark:border-neutral-800">
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
            <div className="grid grid-cols-[140px_1fr_1fr] bg-gray-50 text-xs font-medium text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
              <div className="px-4 py-3">Field</div>
              <div className="px-4 py-3">Sebelum</div>
              <div className="px-4 py-3">Sesudah</div>
            </div>

            {changedFields.map((field) => (
              <div
                key={field}
                className="grid grid-cols-[140px_1fr_1fr] border-t border-gray-200 text-sm dark:border-neutral-800"
              >
                <div className="px-4 py-3 font-medium">
                  {formatFieldName(field)}
                </div>

                <div className="break-words px-4 py-3 text-gray-500 dark:text-gray-400">
                  {field === "gambar" ? (
                    <div className="grid grid-cols-2 gap-2">
                      {(Array.isArray(before[field])
                        ? before[field]
                        : [before[field]]
                      )
                        .filter(Boolean)
                        .map((image: string, index: number) => (
                          <Image
                            key={index}
                            src={getUmkmImage(image)}
                            alt={`Sebelum ${index + 1}`}
                            width={120}
                            height={120}
                            className="h-24 w-24 rounded-lg border border-gray-200 object-cover dark:border-neutral-700"
                          />
                        ))}
                    </div>
                  ) : (
                    formatValue(before[field])
                  )}
                </div>

                <div className="break-words bg-amber-50/70 px-4 py-3 font-medium dark:bg-amber-900/10">
                  {field === "gambar" ? (
                    <div className="grid grid-cols-2 gap-2">
                      {(Array.isArray(after[field])
                        ? after[field]
                        : [after[field]]
                      )
                        .filter(Boolean)
                        .map((image: string, index: number) => (
                          <Image
                            key={index}
                            src={getUmkmImage(image)}
                            alt={`Sesudah ${index + 1}`}
                            width={120}
                            height={120}
                            className="h-24 w-24 rounded-lg border border-gray-200 object-cover dark:border-neutral-700"
                          />
                        ))}
                    </div>
                  ) : (
                    formatValue(after[field])
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
