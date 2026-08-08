import Image from "next/image";
import Link from "next/link";

import type { News } from "@/types/news";

type Props = {
  data: News[];
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function NewsPopular({ data }: Props) {
  if (!data.length) return null;

  return (
    <section className="mb-8 sm:mb-10 xl:mb-12">
      <div className="mb-4 xl:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          Berita Terpopuler
        </h2>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((news) => (
          <Link key={news.id} href={`/berita/${news.slug}`}>
            <article
              className="
                group
                overflow-hidden
                bg-light
                dark:bg-[#1b1b1b]
                border
                border-white
                dark:border-zinc-800
                dark:hover:border-zinc-700
                rounded-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={news.gambar || "/images/news-placeholder.jpg"}
                  alt={news.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {news.category && (
                  <div className="absolute bottom-0 left-0 p-3 sm:p-4 xl:p-5">
                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-white/20
                        px-2
                        py-1
                        xl:px-3
                        text-[10px]
                        xl:text-xs
                        font-medium
                        text-white
                        backdrop-blur
                      "
                    >
                      {news.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4 xl:p-5">
                <div className="mb-2 xl:mb-3 flex flex-wrap items-center gap-2 xl:gap-3 text-xs xl:text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(news.created_at)}</span>

                  <span className="h-1 w-1 rounded-full bg-gray-400" />

                  <span>{news.view_count ?? 0} dilihat</span>
                </div>

                <h3
                  className="
                    line-clamp-2
                    text-base
                    sm:text-lg
                    xl:text-xl
                    font-semibold
                    leading-snug
                    text-gray-900
                    transition
                    group-hover:text-primary
                    dark:text-white
                  "
                >
                  {news.title}
                </h3>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
