export default function LoadingState() {
  return (
    <div className="px-6 pb-6">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-dark-card">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-gray-100 px-5 py-5 last:border-0 dark:border-neutral-800"
          >
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
              <div className="h-3 w-64 animate-pulse rounded bg-gray-100 dark:bg-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
