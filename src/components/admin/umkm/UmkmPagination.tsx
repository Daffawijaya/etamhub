"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import BrandButton from "@/components/ui/BrandButton";

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
  if (totalPages <= 1) return null;

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
    <div
      className="
        flex items-center justify-between
        border-t border-slate-100 dark:border-white/10
        px-4 py-3 sm:px-6 sm:py-4 md:py-5
        transition-colors duration-300
      "
    >
      {/* Page info — always visible */}
      <p
        className="
          text-xs sm:text-sm text-slate-500
          dark:text-slate-400
          transition-colors duration-300
        "
      >
        Hal{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {page}
        </span>{" "}
        / {totalPages}
      </p>

      {/* ── Mobile: compact prev / next only ── */}
      <div className="flex items-center gap-1.5 sm:hidden">
        <BrandButton
          variant="outline"
          size="xs"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          icon={<ChevronLeft size={14} />}
        />

        <BrandButton
          variant="outline"
          size="xs"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          icon={<ChevronRight size={14} />}
        />
      </div>

      {/* ── Desktop: full page numbers ── */}
      <div className="hidden items-center gap-1.5 sm:flex">
        <BrandButton
          variant="outline"
          size="xs"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          icon={<ChevronLeft size={16} />}
        />

        {getPages().map((item, index) =>
          item === "..." ? (
            <span
              key={index}
              className="
                flex h-9 w-9 items-center justify-center
                text-slate-400
                dark:text-slate-500
                transition-colors duration-300
              "
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(Number(item))}
              className={`
                h-9 w-9
                rounded-xl
                text-sm font-medium
                transition-all duration-300

                ${
                  page === item
                    ? `
                      bg-dark
                      text-white
                      shadow-sm
                      dark:bg-white
                      dark:text-dark
                    `
                    : `
                      border border-slate-200
                      bg-white
                      text-slate-700
                      hover:bg-slate-50

                      dark:border-white/10
                      dark:bg-dark-card
                      dark:text-slate-300
                      dark:hover:bg-white/10
                    `
                }
              `}
            >
              {item}
            </button>
          ),
        )}

        <BrandButton
          variant="outline"
          size="xs"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          icon={<ChevronRight size={16} />}
        />
      </div>
    </div>
  );
}
