import Link from "next/link";
import { Plus } from "lucide-react";

import { getNews } from "@/lib/news/news.service";
import NewsTable from "@/components/admin/berita/NewsTable";

interface AdminBeritaPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminBeritaPage({
  searchParams,
}: AdminBeritaPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";

  const news = await getNews(search);

  return (
    <div className="px-6 pb-6">
      <div className="rounded-2xl bg-white dark:bg-dark-card">
        <div className="flex flex-col gap-4 px-6 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 transition-colors duration-300 dark:text-white">
              Daftar Berita
            </h2>

            <p className="mt-1 text-sm text-slate-500 transition-colors duration-300 dark:text-slate-400">
              {news.length} berita tersedia
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
            Tambah Berita
          </Link>
        </div>

        <NewsTable data={news} />
      </div>
    </div>
  );
}
