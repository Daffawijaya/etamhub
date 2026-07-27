"use client";

import { useEffect } from "react";
import NProgress from "nprogress";

export default function RouteLoader() {
  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      if (href && href.startsWith("/") && href !== window.location.pathname) {
        handleStart();
      }
    };

    const handlePopState = () => {
      handleStart();
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
