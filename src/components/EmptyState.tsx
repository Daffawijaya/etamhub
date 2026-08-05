export default function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400">
        ✓
      </div>

      <h2 className="mt-4 font-semibold">Tidak ada request</h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Semua request UMKM sudah diproses.
      </p>
    </div>
  );
}
