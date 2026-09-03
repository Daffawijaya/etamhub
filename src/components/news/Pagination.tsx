"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = { page: number; totalPages: number; search?: string };

export default function Pagination({ page, totalPages, search = "" }: Props) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById("pagination")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [page, search]);
  if (totalPages <= 1) return null;
  const createUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(newPage));
    return `?${params.toString()}`;
  };
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (page <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
    else if (page >= totalPages - 2) pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    else pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-center gap-1 p-6"
    >
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
        <Link scroll={false} href={createUrl(page - 1)} className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${page === 1 ? "pointer-events-none text-slate-400" : "hover:bg-emerald-100 dark:hover:bg-emerald-500/20"}`}>
          <ChevronLeft size={18} />
        </Link>
      </motion.div>
      {pages.map((item, index) =>
        item === "..." ? (
          <span key={`dots-${index}`} className="px-2 text-sm text-slate-500 dark:text-slate-400">
            ...
          </span>
        ) : (
          <motion.div key={item} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Link
              scroll={false}
              href={createUrl(Number(item))}
              className={`flex h-7 min-w-5 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${page === item ? "bg-black text-white dark:bg-white dark:text-black" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"}`}
            >
              {item}
            </Link>
          </motion.div>
        ),
      )}
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
        <Link scroll={false} href={createUrl(page + 1)} className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${page === totalPages ? "pointer-events-none text-slate-400" : "hover:bg-emerald-100 dark:hover:bg-emerald-500/20"}`}>
          <ChevronRight size={18} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
