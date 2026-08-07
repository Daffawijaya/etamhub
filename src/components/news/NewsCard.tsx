import Image from "next/image";
import Link from "next/link";

import type { News } from "@/types/news";

type Props = {
  news: News;
};

export default function NewsCard({ news }: Props) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white">
      {news.gambar && (
        <div className="relative aspect-video">
          <Image
            src={news.gambar}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <div className="mb-2 text-sm text-gray-500">
          {news.category || "Berita"}
        </div>

        <h2 className="line-clamp-2 text-xl font-semibold">{news.title}</h2>

        {news.excerpt && (
          <p className="mt-3 line-clamp-3 text-gray-600">{news.excerpt}</p>
        )}

        <Link
          href={`/berita/${news.slug}`}
          className="mt-4 inline-block text-sm font-medium text-primary"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </article>
  );
}
