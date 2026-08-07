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
    return <div>Belum ada berita.</div>;
  }

  const trendingNews = [...data]
    .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
    .slice(0, 3);

  const trendingIds = new Set(trendingNews.map((news) => news.id));

  const latestNews = data
    .filter((news) => !trendingIds.has(news.id))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  return (
    <div className="space-y-12">
      {/* Trending */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Trending
          </h2>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Berita yang paling banyak dilihat oleh pengunjung etamhub.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trendingNews.map((news) => (
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
                    <div className="absolute bottom-0 left-0 p-5">
                      <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        {news.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(news.created_at)}</span>

                    <span className="h-1 w-1 rounded-full bg-gray-400" />

                    <span>{news.view_count ?? 0} dilihat</span>
                  </div>

                  <h3 className="line-clamp-2 text-xl font-bold leading-snug text-gray-900 transition group-hover:text-primary dark:text-white">
                    {news.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Berita Terbaru */}
      {latestNews.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Berita Terbaru
            </h2>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Informasi terbaru seputar UMKM dan kegiatan etamhub.
            </p>
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
            {latestNews.map((news) => (
              <Link
                key={news.id}
                href={`/berita/${news.slug}`}
                className="block"
              >
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
                        <span className="font-medium text-primary">
                          {news.category}
                        </span>
                      )}

                      {news.category && (
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                      )}

                      <span>{formatDate(news.created_at, true)}</span>
                    </div>

                    <h3
                      className="
                        line-clamp-2
                        text-xl
                        font-bold
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
      )}
    </div>
  );
}
