"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { News } from "@/types/news";

type Props = { data: News[]; currentNewsId?: string };

const formatDate = (date: string) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function NewsTrending({ data, currentNewsId }: Props) {
  const sortedNews = [...data].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));
  const trendingNews = sortedNews
    .map((news, index) => ({ news, rank: index + 1 }))
    .filter(({ news }) => news.id !== currentNewsId)
    .slice(0, 3);
  if (!trendingNews.length) return null;
  return (
    <motion.aside
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#121212]"
    >
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Trending</h2>
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            Terpopuler
          </span>
        </div>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } }}
        className="divide-y divide-zinc-100 dark:divide-zinc-800/60"
      >
        {trendingNews.map(({ news, rank }) => (
          <motion.div
            key={news.id}
            variants={{ hidden: { opacity: 0, x: -12, filter: "blur(4px)" }, visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
            whileHover={{ x: 4 }}
          >
            <Link href={`/berita/${news.slug}`} className="block">
              <article className="group flex gap-4 p-4 transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image src={news.gambar || "/images/news-placeholder.jpg"} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: rank * 0.06 }}
                    className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/90 text-xs font-bold text-white backdrop-blur-sm dark:bg-white/90 dark:text-zinc-900"
                  >
                    {rank}
                  </motion.span>
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-1.5">
                  <h3 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-800 transition-colors group-hover:text-zinc-500 dark:text-zinc-200 dark:group-hover:text-zinc-400">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                    <span>{formatDate(news.created_at)}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    <span>{news.view_count ?? 0} dilihat</span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.aside>
  );
}
