import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function CatalogPagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-10">
      <button
        type="button"
        aria-label="Halaman sebelumnya"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white disabled:pointer-events-none disabled:opacity-35 dark:text-zinc-300 dark:hover:bg-white/10"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {page} dari {totalPages}
      </span>
      <button
        type="button"
        aria-label="Halaman berikutnya"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white disabled:pointer-events-none disabled:opacity-35 dark:text-zinc-300 dark:hover:bg-white/10"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
