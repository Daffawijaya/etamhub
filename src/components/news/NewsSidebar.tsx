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

export default function NewsSidebar({ data }: Props) {
  const latestNews = data.slice(0, 5);

  return (
    <aside>
      <div
        className="
          rounded-xl
          bg-light
          dark:bg-[#1b1b1b]
          border
          border-white
          dark:border-zinc-800
          overflow-hidden
        "
      >
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Berita Terbaru
          </h2>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {latestNews.map((news) => (
            <Link key={news.id} href={`/berita/${news.slug}`} className="block">
              <article
                className="
                  flex
                  gap-4
                  p-4
                  transition
                  hover:bg-zinc-50
                  dark:hover:bg-[#222]
                "
              >
                <div
                  className="
                    relative
                    h-20
                    w-24
                    shrink-0
                    overflow-hidden
                    rounded-lg
                  "
                >
                  <Image
                    src={news.gambar || "/images/news-placeholder.jpg"}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h3
                    className="
                      line-clamp-2
                      text-sm
                      font-semibold
                      leading-snug
                      text-zinc-900
                      dark:text-white
                    "
                  >
                    {news.title}
                  </h3>

                  <span className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(news.created_at)}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
