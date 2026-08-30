import Image from "next/image";
import { CalendarDays, Eye } from "lucide-react";

import type { News } from "@/types/news";
import NewsContent from "./NewsContent";

type Props = {
  news: News;
};

export default function NewsDetail({ news }: Props) {
  const publishedDate = news.published_at ?? news.created_at;

  return (
    <article
      className="
        bg-light
        dark:bg-dark-card
        border
        border-white
        dark:border-zinc-800
        rounded-xl
        transition-all
        duration-300
        p-5
        sm:p-8
        lg:p-10
      "
    >
      {news.category && (
        <span
          className="
            inline-flex
            rounded-full
            bg-emerald-50
            px-3
            py-1
            text-xs
            font-medium
            text-emerald-700
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          {news.category}
        </span>
      )}

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

          <span>{news.view_count ?? 0} dilihat</span>
        </div>
      </div>

      {news.gambar && (
        <div className="mx-auto my-8 aspect-[3/2] w-full max-w-[900px] overflow-hidden rounded-xl">
          <Image
            src={news.gambar}
            alt={news.title}
            width={900}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 900px"
            className="h-full w-full object-cover"
            priority
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
  );
}
