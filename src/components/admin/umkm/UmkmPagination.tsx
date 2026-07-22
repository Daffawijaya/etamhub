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
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <p className="text-sm text-slate-500">
        Halaman {page} dari {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: totalPages }).map((_, index) => {
          const number = index + 1;

          return (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`h-9 w-9 rounded-lg text-sm ${
                page === number
                  ? "bg-primary text-white"
                  : "border text-slate-600"
              }`}
            >
              {number}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
