"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function UmkmPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-slate-500">
        Halaman <span className="font-semibold text-slate-900">{page}</span>{" "}
        dari <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {getPages().map((item, index) =>
          item === "..." ? (
            <span
              key={index}
              className="flex h-10 w-10 items-center justify-center text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(Number(item))}
              className={`h-10 w-10 rounded-xl text-sm font-medium transition ${
                page === item
                  ? "bg-dark text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
