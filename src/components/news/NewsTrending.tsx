import Image from "next/image";
import Link from "next/link";

import type { News } from "@/types/news";

type Props = {
  data: News[];
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function NewsTrending({ data }: Props) {
  const trendingNews = [...data]
    .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
    .slice(0, 3);

  if (!trendingNews.length) {
    return null;
  }

  return (
    <aside>
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-amber-100
          bg-amber-50/70
          dark:border-amber-500/20
          dark:bg-[#211e16]
        "
      >
        <div className="border-b border-amber-100 px-5 py-4 dark:border-amber-500/20">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-amber-900 dark:text-amber-300">
              Trending
            </h2>

            <span
              className="
                rounded-full
                bg-amber-100
                px-2
                py-0.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-amber-700
                dark:bg-amber-500/15
                dark:text-amber-300
              "
            >
              Terpopuler
            </span>
          </div>

          <p className="mt-1 text-xs text-amber-700/70 dark:text-amber-400/70">
            Berita yang paling banyak dilihat.
          </p>
        </div>

        <div className="divide-y divide-amber-100 dark:divide-amber-500/20">
          {trendingNews.map((news, index) => (
            <Link key={news.id} href={`/berita/${news.slug}`} className="block">
              <article
                className="
                  group
                  flex
                  gap-4
                  p-4
                  transition
                  hover:bg-amber-100/60
                  dark:hover:bg-amber-500/5
                "
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={news.gambar || "/images/news-placeholder.jpg"}
                    alt={news.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span
                    className="
                      absolute
                      left-2
                      top-2
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-amber-500
                      text-xs
                      font-bold
                      text-white
                      shadow-sm
                    "
                  >
                    {index + 1}
                  </span>
                </div>

                <div className="flex min-w-0 flex-col justify-center">
                  <h3
                    className="
                      line-clamp-2
                      text-sm
                      font-semibold
                      leading-snug
                      text-zinc-900
                      transition
                      group-hover:text-amber-700
                      dark:text-white
                      dark:group-hover:text-amber-300
                    "
                  >
                    {news.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{formatDate(news.created_at)}</span>

                    <span className="h-1 w-1 rounded-full bg-zinc-400" />

                    <span>{news.view_count ?? 0} dilihat</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
