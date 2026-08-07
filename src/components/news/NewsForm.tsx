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
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Berita Terpopuler
        </h2>

        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Berita yang paling banyak dilihat oleh pengunjung etamhub.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="absolute bottom-0 left-0 p-5">
                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-white/20
                        px-3
                        py-1
                        text-xs
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

              <div className="p-5">
                <div className="mb-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(news.created_at)}</span>

                  <span className="h-1 w-1 rounded-full bg-gray-400" />

                  <span>{news.view_count ?? 0} dilihat</span>
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
  );
}
