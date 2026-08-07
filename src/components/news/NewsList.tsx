import Image from "next/image";

import type { News } from "@/types/news";

type Props = {
  data: News[];
};

export default function NewsList({ data }: Props) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-dark-card">
        Belum ada berita.
      </div>
    );
  }

  const [latestNews, ...otherNews] = data;

  return (
    <div className="space-y-10">
      {/* Berita Terbaru */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Berita Terbaru
          </h2>
        </div>

        <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl dark:border-gray-800 dark:bg-dark-card">
          <div className="relative aspect-[16/7] overflow-hidden">
            <Image
              src={latestNews.gambar || "/images/news-placeholder.jpg"}
              alt={latestNews.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="mb-3 flex items-center gap-3 text-sm text-white/80">
                <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                  {latestNews.category}
                </span>

                <span>
                  {new Date(latestNews.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h1 className="max-w-3xl text-2xl font-bold leading-tight text-white md:text-4xl">
                {latestNews.title}
              </h1>
            </div>
          </div>
        </article>
      </section>

      {/* List Berita */}
      {otherNews.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Berita Lainnya
            </h2>
          </div>

          <div className="space-y-4">
            {otherNews.map((news) => (
              <article
                key={news.id}
                className="group flex gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-dark-card"
              >
                <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={news.gambar || "/images/news-placeholder.jpg"}
                    alt={news.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-gray-900 transition group-hover:text-primary dark:text-white">
                    {news.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="rounded-full text-primary">
                      {news.category}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-gray-400" />

                    <span>
                      {new Date(news.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
