import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye, Pencil } from "lucide-react";

import { getNewsById } from "@/lib/news/news.service";
import NewsContent from "@/components/news/NewsContent";

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
        <div className="rounded-xl border border-white bg-light p-6 dark:border-zinc-800 dark:bg-[#1b1b1b]">
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
    );
  }

  const publishedDate = news.published_at ?? news.created_at;

  return (
    <div className="px-6 pb-6">
      <div className="overflow-hidden rounded-xl border border-white bg-light dark:border-zinc-800 dark:bg-[#1b1b1b]">
        <div className="flex items-center justify-between border-b border-white px-6 py-4 dark:border-zinc-800">
          <Link
            href="/admin/berita"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-600
              transition-colors
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            <ArrowLeft size={16} />
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

        <article className="p-6">
          <div className="flex items-center justify-between gap-4">
            {news.category ? (
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {news.category}
              </span>
            ) : (
              <span />
            )}

            <div
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                news.published
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  news.published
                    ? "bg-emerald-500"
                    : "bg-zinc-400 dark:bg-zinc-500"
                }`}
              />

              {news.published ? "Publik" : "Privat"}
            </div>
          </div>

          <h1
            className="
              mt-4
              text-3xl
              font-bold
              leading-tight
              text-slate-900
              sm:text-4xl
              dark:text-white
            "
          >
            {news.title}
          </h1>

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-4
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
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

          {news.gambar && (
            <div className="mx-auto my-8 aspect-[3/2] w-full max-w-[900px] overflow-hidden rounded-xl">
              <Image
                src={news.gambar}
                alt={news.title}
                width={900}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {news.excerpt && (
            <p
              className="
                mt-8
                border-l-4
                border-emerald-500
                pl-4
                text-base
                leading-7
                text-slate-600
                dark:text-slate-300
              "
            >
              {news.excerpt}
            </p>
          )}

          <div className="my-8 border-t border-white dark:border-zinc-800" />

          <NewsContent content={news.content} />
        </article>
      </div>
    </div>
  );
}
