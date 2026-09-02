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
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                Daftar Berita
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                {result.pagination.total} berita tersedia
              </p>
            </div>

            {/* Search + Tambah — right side */}
            <div className="flex items-center gap-2">
              <NewsSearch />

              <Link
                href="/admin/berita/tambah"
                className="flex items-center gap-2 rounded-lg bg-brand-accent px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-accent-hover sm:px-4 sm:text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Tambah Berita</span>
                <span className="sm:hidden">Tambah</span>
              </Link>
            </div>
          </div>
        </div>

        <NewsTable data={news} role={user?.role ?? undefined} pagination={result.pagination} />
      </div>
    </div>
  );
}
