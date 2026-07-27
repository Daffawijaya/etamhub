"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname]);
  return (
    <NextTopLoader
      color="#844EC0"
      initialPosition={0.08}
      crawlSpeed={300}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="cubic-bezier(0.22, 1, 0.36, 1)"
      speed={600}
      shadow="0 0 10px #844EC0, 0 0 5px #CA3785"
    />
  );
}
