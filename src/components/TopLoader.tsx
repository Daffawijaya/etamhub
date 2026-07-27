"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  const pathname = usePathname();

  // selesai saat route berubah
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  // saat refresh / pertama buka halaman
  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // klik link
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

    const handleBackForward = () => {
      NProgress.start();
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handleBackForward);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handleBackForward);
    };
  }, []);

  return (
    <NextTopLoader
      color="#844EC0"
      initialPosition={0.08}
      crawlSpeed={300}
      height={2}
      crawl={true}
      showSpinner={false}
      easing="cubic-bezier(0.22, 1, 0.36, 1)"
      speed={600}
      shadow="0 0 10px #844EC0, 0 0 5px #CA3785"
    />
  );
}
