"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-white
          bg-light-bg
          text-zinc-700
          transition-all
          duration-300
          hover:border-violet-500/20
          hover:bg-violet-500/10
          hover:text-zinc-900
          disabled:cursor-not-allowed
          disabled:opacity-40
          dark:border-white/10
          dark:bg-[#161616]
          dark:text-zinc-300
          dark:hover:text-white
        "
      >
        ←
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              h-10
              w-10
              rounded-xl
              text-sm
              font-medium
              transition-all
              duration-300
              ${
                currentPage === page
                  ? `
                    border
                    border-violet-500/20
                    bg-violet-500/10
                    text-violet-600
                    dark:text-violet-300
                  `
                  : `
                    border
                    border-white
                    bg-light-bg
                    text-zinc-500
                    hover:border-violet-500/20
                    hover:bg-violet-500/10
                    hover:text-zinc-900
                    dark:border-white/10
                    dark:bg-[#161616]
                    dark:text-zinc-400
                    dark:hover:text-white
                  `
              }
            `}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-white
          bg-light-bg
          text-zinc-700
          transition-all
          duration-300
          hover:border-violet-500/20
          hover:bg-violet-500/10
          hover:text-zinc-900
          disabled:cursor-not-allowed
          disabled:opacity-40
          dark:border-white/10
          dark:bg-[#161616]
          dark:text-zinc-300
          dark:hover:text-white
        "
      >
        →
      </button>
    </div>
  );
}