"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { News } from "@/types/news";
import NewsRowActions from "./NewsRowActions";
import NewsSearch from "./NewsSearch";

interface NewsTableProps {
  data?: News[];
}

const getStatusStyle = (published: boolean | null) => {
  return published
    ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300"
    : "bg-slate-500/10 text-slate-500 dark:text-slate-400";
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function NewsTable({ data = [] }: NewsTableProps) {
  const [news, setNews] = useState(data);

  useEffect(() => {
    setNews(data);
  }, [data]);

  const handleChanged = (id: string) => {
    setNews((current) => current.filter((item) => item.id !== id));
  };

  const handleStatusChanged = (id: string, published: boolean) => {
    setNews((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              published,
            }
          : item,
      ),
    );
  };

  return (
    <div>
      <div className="mb-4 px-6">
        <NewsSearch />
      </div>

      <div className="w-full">
        {news.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Belum ada berita atau berita tidak ditemukan.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1050px] md:min-w-[1050px] lg:min-w-0">
              <div className="divide-y divide-slate-100 dark:divide-white/10">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="
                    grid
                    grid-cols-[minmax(0,1fr)_150px_110px_120px_44px]
                    items-center
                    gap-4
                    px-6
                    py-3
                    transition-colors
                    duration-300
                    hover:bg-slate-50/70
                    dark:hover:bg-white/[0.03]
                    max-md:px-4
                  "
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                        {item.gambar ? (
                          <Image
                            src={item.gambar}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                            -
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.category || "-"}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`
                        inline-flex
                        min-w-[76px]
                        justify-center
                        rounded-full
                        px-3
                        py-1.5
                        text-sm
                        font-medium
                        ${getStatusStyle(item.published)}
                      `}
                      >
                        {item.published ? "Publik" : "Privat"}
                      </span>
                    </div>

                    <div>
                      <p className="whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(item.created_at)}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <NewsRowActions
                        id={item.id}
                        published={item.published}
                        onDeleted={handleChanged}
                        onStatusChanged={handleStatusChanged}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
