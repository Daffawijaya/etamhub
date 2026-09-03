"use client";

import Image from "next/image";
import { CalendarDays, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { News } from "@/types/news";
import NewsContent from "./NewsContent";

type Props = { news: News };

export default function NewsDetail({ news }: Props) {
  const publishedDate = news.published_at ?? news.created_at;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-light dark:bg-dark-card border border-white dark:border-zinc-800 rounded-xl transition-colors duration-300 p-5 sm:p-8 lg:p-10 overflow-hidden"
    >
      {news.category && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          {news.category}
        </motion.span>
      )}
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } } }}
        className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-white"
      >
        {news.title.split(" ").map((w, i) => (
          <motion.span
            key={w + i}
            variants={{ hidden: { y: 16, opacity: 0, filter: "blur(6px)" }, visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
            className="inline-block mr-[0.24em] last:mr-0"
          >
            {w}
          </motion.span>
        ))}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>{new Date(publishedDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye size={16} />
          <span>{news.view_count ?? 0} dilihat</span>
        </div>
      </motion.div>
      {news.gambar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto my-8 aspect-[3/2] w-full max-w-[900px] overflow-hidden rounded-xl"
        >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="h-full w-full">
            <Image src={news.gambar} alt={news.title} width={900} height={600} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 900px" className="h-full w-full object-cover" priority />
          </motion.div>
        </motion.div>
      )}
      {news.excerpt && (
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 border-l-4 border-emerald-500 pl-4 text-base leading-7 text-slate-600 dark:text-slate-300"
        >
          {news.excerpt}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="my-8 border-t border-white dark:border-zinc-800 origin-left"
      />
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
        <NewsContent content={news.content} />
      </motion.div>
    </motion.article>
  );
}
