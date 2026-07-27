"use client";

import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { usePathname } from "next/navigation";

export default function GlobalLoader() {
  const pathname = usePathname();
  const [initialLoading, setInitialLoading] = useState(true);

  // Refresh / pertama kali buka halaman
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Route selesai
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  // Klik link
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      if (
        href &&
        href.startsWith("/") &&
        href !== window.location.pathname &&
        !link.hasAttribute("target")
      ) {
        NProgress.start();
      }
    };

    // Back / forward browser
    const handlePopState = () => {
      NProgress.start();
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!initialLoading) return null;

  return (
    <div className="fixed top-0 left-0 z-[99999] h-[2px] w-full overflow-hidden">
      <div className="h-full w-1/2 animate-loading bg-gradient-to-r from-violet-500 via-fuchsia-400 to-transparent" />
    </div>
  );
}
