'use client';

import dynamic from "next/dynamic";

// Import the component dynamically and disable Server-Side Rendering (SSR)
const TambahUmkmForm = dynamic(
  () => import("@/components/admin/umkm/TambahUmkmForm"),
  { ssr: false },
);

export default function Page() {
  return (
    <div className="w-full px-6 pb-6 bg-light dark:bg-dark h-min-screen">
      <TambahUmkmForm />
    </div>
  );
}
