"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { News } from "@/types/news";

type Props = { data: News[] };

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function NewsPopular({ data }: Props) {
  if (!data.length) return null;
  return (
    <section className="mb-8 sm:mb-10 xl:mb-12">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4 xl:mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Berita Terpopuler</h2>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {data.map((news) => (
          <motion.div
            key={news.id}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(6px)" },
              visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
            }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            <Link href={`/berita/${news.slug}`}>
              <article className="group overflow-hidden bg-light dark:bg-[#1b1b1b] border border-white dark:border-zinc-800 dark:hover:border-zinc-700 rounded-xl transition-colors duration-300 hover:shadow-lg relative">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_60%)] pointer-events-none" />
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={news.gambar || "/images/news-placeholder.jpg"} alt={news.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {news.category && (
                    <div className="absolute bottom-0 left-0 p-3 sm:p-4 xl:p-5">
                      <span className="inline-flex rounded-full bg-white/20 px-2 py-1 xl:px-3 text-[10px] xl:text-xs font-medium text-white backdrop-blur">
                        {news.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative p-3 sm:p-4 xl:p-5">
                  <div className="mb-2 xl:mb-3 flex flex-wrap items-center gap-2 xl:gap-3 text-xs xl:text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(news.created_at)}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400" />
                    <span>{news.view_count ?? 0} dilihat</span>
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
