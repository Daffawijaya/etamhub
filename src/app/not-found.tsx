import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-bg px-4 text-center dark:bg-dark">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">404</h1>
      <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
