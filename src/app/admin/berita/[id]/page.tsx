import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye, Pencil } from "lucide-react";

import { getNewsById } from "@/lib/news/news.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminBeritaPreviewPage({ params }: Props) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    return (
      <div className="px-6 pb-6">
        <div className="flex min-h-60 items-center justify-center rounded-2xl bg-white dark:bg-dark-card">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              Berita tidak ditemukan
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Berita yang ingin dilihat tidak tersedia.
            </p>

            <Link
              href="/admin/berita"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft size={16} />
              Kembali ke Berita
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const publishedDate = news.published_at ?? news.created_at;

  return (
    <div className="px-6 pb-6">
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-dark-card">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <Link
            href="/admin/berita"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft size={17} />
            Kembali
          </Link>

          <Link
            href={`/admin/berita/${news.id}/edit`}
            className="
              inline-flex
              items-center
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
              focus:ring-offset-white
              dark:bg-emerald-500
              dark:hover:bg-emerald-400
              dark:focus:ring-emerald-400
              dark:focus:ring-offset-slate-900
            "
          >
            <Pencil size={16} />
            Edit Berita
          </Link>
        </div>

        <article className="px-6 py-8 sm:px-10 lg:px-12">
          {news.gambar && (
            <div className="mx-auto mb-8 aspect-[3/2] w-full max-w-[900px] overflow-hidden rounded-xl">
              <img
                src={news.gambar}
                alt={news.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {news.category && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {news.category}
              </span>
            )}

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                news.published
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {news.published ? "Published" : "Draft"}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-white">
            {news.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              <span>
                {new Date(publishedDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{news.view_count ?? 0} kali dilihat</span>
            </div>
          </div>

          {news.excerpt && (
            <p className="mt-8 border-l-4 border-emerald-500 pl-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              {news.excerpt}
            </p>
          )}

          <div className="my-8 border-t border-slate-200 dark:border-slate-700" />

          <div className="whitespace-pre-wrap text-base leading-8 text-slate-700 dark:text-slate-300">
            {news.content}
          </div>
        </article>
      </div>
    </div>
  );
}
