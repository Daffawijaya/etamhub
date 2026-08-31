import Link from "next/link";
import { Plus } from "lucide-react";

import { getNews } from "@/lib/news/news.service";
import { getCurrentUser } from "@/lib/session";
import NewsTable from "@/components/admin/berita/NewsTable";
import NewsSearch from "@/components/admin/berita/NewsSearch";

interface AdminBeritaPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function AdminBeritaPage({
  searchParams,
}: AdminBeritaPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";

  const user = await getCurrentUser();

  // Admin kecamatan hanya lihat berita yang dia tulis
  const authorId =
    user?.role === "admin_kecamatan" ? user.id : undefined;

  const result = await getNews({
    search,
    page: Number(params.page ?? 1),
    limit: 10,
    authorId,
  });

  const news = result.data;

  return (
    <div>
      <div className="rounded-xl bg-white transition-colors duration-300 dark:bg-dark-card">
        <div className="px-4 pt-4 pb-3 flex flex-col gap-3 sm:px-6 sm:pt-5 sm:pb-4 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Daftar Berita
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {result.pagination.total} berita tersedia
            </p>
          </div>

          <Link
            href="/admin/berita/tambah"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-emerald-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition-all
              duration-200
              hover:bg-emerald-700
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
              focus:ring-offset-2
              dark:bg-emerald-500
              dark:hover:bg-emerald-400
            "
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Tambah Berita</span>
            <span className="sm:hidden">Tambah</span>
          </Link>
        </div>

        <div className="mb-5 max-w-md px-4 sm:px-5">
          <NewsSearch />
        </div>

        <NewsTable data={news} pagination={result.pagination} />
      </div>
    </div>
  );
}
