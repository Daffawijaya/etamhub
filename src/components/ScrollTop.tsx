'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Gunakan useLayoutEffect agar perubahan style terjadi sebelum browser melakukan paint
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    // Lewati render pertama saat website baru dimuat agar tidak mengganggu initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 1. Matikan smooth scroll secara instan saat alamat (pathname) berubah
    document.documentElement.style.scrollBehavior = 'auto';

    // 2. Aktifkan kembali smooth scroll setelah perpindahan halaman selesai (100ms)
    // agar navigasi hash (#) di dalam halaman yang sama tetap halus
    const timeout = setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}