"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { News } from "@/types/news";
import NewsRowActions from "./NewsRowActions";
import Pagination from "./Pagination";

interface NewsTableProps {
  data?: News[];
  role?: string;
  pagination?: {
    page: number;
    totalPages: number;
  };
}

const getStatusStyle = (published: boolean | null) => {
  return published
    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
    : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400";
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function NewsTable({ data = [], role, pagination }: NewsTableProps) {
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
    <div className="w-full">
      {news.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Belum ada berita atau berita tidak ditemukan.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: table view */}
          <div className="hidden md:block w-full overflow-x-auto">
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
                        rounded-lg
                        px-2.5
                        py-1
                        text-xs
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
                      role={role}
                      onDeleted={handleChanged}
                      onStatusChanged={handleStatusChanged}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: card view */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-white/10">
            {news.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors duration-300 hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
              >
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                  {item.gambar ? (
                    <Image
                      src={item.gambar}
                      alt={item.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                      -
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.category || "-"}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`
                      inline-flex
                      rounded-lg
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      ${getStatusStyle(item.published)}
                    `}
                  >
                    {item.published ? "Publik" : "Privat"}
                  </span>
                  <NewsRowActions
                    id={item.id}
                    published={item.published}
                    role={role}
                    onDeleted={handleChanged}
                    onStatusChanged={handleStatusChanged}
                  />
                </div>
              </div>
            ))}
          </div>

          {pagination && (
            <div className="">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
