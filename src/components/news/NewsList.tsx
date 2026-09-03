"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { News } from "@/types/news";

type Props = { data: News[]; search?: string; total?: number };

const formatDate = (date: string, short = false) =>
  new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: short ? "short" : "long", year: "numeric" });

export default function NewsList({ data, search = "", total = 0 }: Props) {
  const router = useRouter();
  const isSearching = search.trim().length > 0;
  if (!data.length) {
    return (
      <section>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[120px] xl:min-h-[160px] flex-col items-center justify-center p-4 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center text-sm sm:text-base">
            <p className="text-gray-900 dark:text-white">Tidak ada berita ditemukan.</p>
            {isSearching && (
              <button type="button" onClick={() => router.push("/berita", { scroll: false })} className="text-gray-900 dark:text-white transition underline hover:no-underline">
                Hapus pencarian
              </button>
            )}
          </div>
        </motion.div>
      </section>
    );
  }
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4 xl:mb-6"
      >
        {isSearching ? (
          <div className="mb-6 xl:mb-8 text-center">
            <p className="text-sm sm:text-base text-gray-900 dark:text-white">{total} berita ditemukan</p>
          </div>
        ) : (
          <h2 className="mb-4 xl:mb-6 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Berita Terbaru</h2>
        )}
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
        className="overflow-hidden rounded-xl border border-white bg-light dark:bg-[#1b1b1b] dark:border-zinc-800 divide-y divide-white dark:divide-zinc-800"
      >
        {data.map((news) => (
          <motion.div
            key={news.id}
            variants={{
              hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <Link href={`/berita/${news.slug}`} className="block">
              <article className="group flex flex-row gap-3 p-3 sm:gap-4 sm:p-4 xl:gap-5 xl:p-5 transition-colors duration-300 hover:bg-zinc-50 dark:hover:bg-[#222] relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_left,rgba(139,92,246,0.06),transparent_70%)] pointer-events-none" />
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32 xl:h-24 xl:w-32">
                  <Image src={news.gambar || "/images/news-placeholder.jpg"} alt={news.title} fill sizes="(max-width: 640px) 112px, 128px" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="relative flex flex-col justify-center min-w-0">
                  <div className="mb-1 sm:mb-2 xl:mb-3 flex flex-wrap items-center gap-1 sm:gap-2 xl:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {news.category && (
                      <>
                        <span className="font-medium text-primary">{news.category}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                      </>
                    )}
                    <span>{formatDate(news.created_at, true)}</span>
                  </div>
                  <h3 className="line-clamp-2 text-base sm:text-lg xl:text-xl font-semibold leading-snug text-gray-900 transition group-hover:text-primary dark:text-white">
                    {news.title}
                  </h3>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
