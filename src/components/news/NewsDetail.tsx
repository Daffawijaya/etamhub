import Image from "next/image";

import type { News } from "@/types/news";

type Props = {
  news: News;
};

export default function NewsDetail({ news }: Props) {
  return (
    <article className="mx-auto max-w-4xl">
      {news.gambar && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={news.gambar}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
        <span>{news.category || "Berita"}</span>

        <span>
          {new Date(news.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <h1 className="text-3xl font-bold">{news.title}</h1>

      {news.excerpt && (
        <p className="mt-4 text-lg text-gray-600">{news.excerpt}</p>
      )}

      <div
        className="prose mt-8 max-w-none"
        dangerouslySetInnerHTML={{
          __html: news.content,
        }}
      />
    </article>
  );
}
