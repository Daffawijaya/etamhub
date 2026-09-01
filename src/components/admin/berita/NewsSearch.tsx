"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NewsSearch() {
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  return (
    <form action="/admin/berita" method="GET" className="relative min-w-0 flex-1 h-10 sm:h-11 sm:max-w-sm">
      <Search
        size={16}
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          z-10
          -translate-y-1/2
          text-slate-400
          dark:text-slate-500
          transition-colors
          duration-300
          sm:left-4
          sm:size-[18px]
        "
      />

      <input
        type="text"
        name="search"
        placeholder="Cari berita..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="
          h-10
          w-full
          rounded-xl
          sm:h-11
          sm:rounded-2xl

          border
          border-slate-200
          dark:border-slate-800

          bg-white
          dark:bg-dark

          pl-10
          pr-4
          sm:pl-11

          text-sm

          text-slate-700
          dark:text-white

          placeholder:text-slate-400
          dark:placeholder:text-slate-500

          outline-none

          transition-all
          duration-300

          hover:border-slate-300
          dark:hover:border-slate-700

          focus:border-sky-500
          focus:ring-4
          focus:ring-sky-500/10
        "
      />
    </form>
  );
}
