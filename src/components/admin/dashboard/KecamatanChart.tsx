"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BrandButton from "@/components/ui/BrandButton";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
  allNames?: string[];
}

const PER_PAGE = 10;

export default function KecamatanChart({ data, allNames = [] }: Props) {
  const [page, setPage] = useState(1);

  // Merge data with all kecamatan names, fill missing with 0
  const dataMap = new Map(data.map((d) => [d.name, d.value]));
  const merged = allNames.map((name) => ({
    name,
    value: dataMap.get(name) ?? 0,
  }));

  // Sort by value descending, then alphabetically for ties
  const sorted = [...merged].sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

  const maxValue = sorted[0]?.value ?? 1;
  const totalUmkm = sorted.reduce((acc, item) => acc + item.value, 0);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const pageData = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Kecamatan
        </h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <BrandButton
              variant="outline"
              size="xs"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              icon={<ChevronLeft size={14} />}
            />
            <span className="px-1.5 text-xs text-slate-400">
              {page}/{totalPages}
            </span>
            <BrandButton
              variant="outline"
              size="xs"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              icon={<ChevronRight size={14} />}
            />
          </div>
        )}
      </div>

      <div className="space-y-5">
        {pageData.map((item) => {
          const percentage = totalUmkm ? ((item.value / totalUmkm) * 100).toFixed(1) : "0";

          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {item.name}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.value} UMKM
                  </span>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-dark dark:text-slate-300">
                    {percentage}%
                  </span>
                </div>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-dark">
                {(() => {
                  const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                  return (
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, #1184CA 0%, #844EC0 50%, #CA3785 100%)",
                        // gradasi fixed selebar track, bukan stretch per bar — biar dikit cuma biru
                        backgroundSize: pct > 0 ? `${100 / (pct / 100)}% 100%` : "0% 100%",
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
