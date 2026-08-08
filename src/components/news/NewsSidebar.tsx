import Image from "next/image";
import Link from "next/link";

import type { News } from "@/types/news";

type Props = {
  data: News[];
  currentNews: News;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STOP_WORDS = new Set([
  "yang",
  "dan",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "pada",
  "dalam",
  "ini",
  "itu",
  "akan",
  "jadi",
  "oleh",
  "sebagai",
  "ada",
  "atau",
  "bagi",
  "lebih",
  "agar",
  "telah",
  "sudah",
  "juga",
  "tidak",
  "kini",
  "hingga",
  "para",
  "se",
]);

const normalizeTitle = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

const calculateTitleSimilarity = (
  currentTitle: string,
  targetTitle: string,
) => {
  const currentWords = new Set(normalizeTitle(currentTitle));
  const targetWords = new Set(normalizeTitle(targetTitle));

  if (!currentWords.size || !targetWords.size) {
    return 0;
  }

  let matchingWords = 0;

  for (const word of currentWords) {
    if (targetWords.has(word)) {
      matchingWords++;
    }
  }

  return matchingWords / Math.max(currentWords.size, targetWords.size);
};

export default function NewsSidebar({ data, currentNews }: Props) {
  const recommendations = data
    .filter((news) => news.id !== currentNews.id)
    .map((news) => {
      const titleSimilarity = calculateTitleSimilarity(
        currentNews.title,
        news.title,
      );

      const sameCategory =
        Boolean(currentNews.category) &&
        Boolean(news.category) &&
        currentNews.category === news.category;

      const createdAt = new Date(news.created_at).getTime();

      return {
        news,
        titleSimilarity,
        sameCategory,
        createdAt,
      };
    })
    .sort((a, b) => {
      // Prioritas utama: semakin banyak kata judul yang sama.
      if (b.titleSimilarity !== a.titleSimilarity) {
        return b.titleSimilarity - a.titleSimilarity;
      }

      // Jika kemiripan judul sama, prioritaskan kategori yang sama.
      if (b.sameCategory !== a.sameCategory) {
        return Number(b.sameCategory) - Number(a.sameCategory);
      }

      // Jika masih sama, prioritaskan berita yang lebih baru.
      return b.createdAt - a.createdAt;
    })
    .slice(0, 5)
    .map(({ news }) => news);

  if (!recommendations.length) {
    return null;
  }

  return (
    <aside className="overflow-hidden rounded-xl border border-white bg-light dark:border-zinc-800 dark:bg-dark-card">
      <div className="border-b border-white px-4 py-4 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Berita Terkait
        </h2>
      </div>

      <div className="divide-y divide-white dark:divide-zinc-800">
        {recommendations.map((news) => (
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
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center">
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
    </aside>
  );
}
