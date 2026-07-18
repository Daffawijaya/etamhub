"use client";

import UmkmMap from "@/components/map/UmkmMap";
import Navbar from "@/components/navbar/Navbar";

export default function PetaPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-0">
        <UmkmMap />
      </main>
    </>
  );
}