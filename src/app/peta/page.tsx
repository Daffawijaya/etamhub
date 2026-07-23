"use client";

import UmkmMap from "@/components/map/UmkmMap";
import Navbar from "@/components/navbar/Navbar";

export default function PetaPage() {
  return (
    <>
      <div className="absolute z-90">
        <Navbar />
      </div>

      <main className="relative h-screen w-full z-0">
        <UmkmMap />
      </main>
    </>
  );
}
