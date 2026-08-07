import Image from "next/image";
import Link from "next/link";

import type { News } from "@/types/news";

type Props = {
  data: News[];
};

const formatDate = (date: string, short = false) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: short ? "short" : "long",
    year: "numeric",
  });

export default function NewsList({ data }: Props) {
  if (!data.length) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        Belum ada berita.
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Berita Terbaru
        </h2>
      </div>

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-white
          bg-light
          dark:bg-[#1b1b1b]
          dark:border-zinc-800
          divide-y
          divide-white
          dark:divide-zinc-800
        "
      >
        {data.map((news) => (
          <Link key={news.id} href={`/berita/${news.slug}`} className="block">
            <article
              className="
                group
                flex
                gap-5
                p-5
                transition-all
                duration-300
                hover:bg-zinc-50
                dark:hover:bg-[#222]
              "
            >
              <div
                className="
                  relative
                  h-24
                  w-32
                  shrink-0
                  overflow-hidden
                  rounded-lg
                  sm:h-24
                  sm:w-32
                "
              >
                <Image
                  src={news.gambar || "/images/news-placeholder.jpg"}
                  alt={news.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="mb-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  {news.category && (
                    <>
                      <span className="font-medium text-primary">
                        {news.category}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-gray-400" />
                    </>
                  )}

                  <span>{formatDate(news.created_at, true)}</span>
                </div>

                <h3
                  className="
                    line-clamp-2
                    text-xl
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
