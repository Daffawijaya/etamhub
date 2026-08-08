"use client";

import Image from "next/image";
import HeroNavbar from "../navbar/HeroNavbar";
import NewsSearch from "./NewsSearch";
import { useState } from "react";
export default function HeroBackground() {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Search:", search);
  };
  return (
    <section className="relative transition-colors h-[61vh] flex flex-col">
      {/* Background Atas - Gradien / Gambar */}
      <div
        className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-[350%]
                sm:w-[280%]
                md:w-[200%]
                lg:w-[150%]
                xl:w-full
                pointer-events-none
              "
        style={{
          WebkitMaskImage: `
                  linear-gradient(
                    to bottom,
                    #000 0%,
                    rgba(0,0,0,.85) 10%,
                    rgba(0,0,0,.55) 20%,
                    rgba(0,0,0,.25) 30%,
                    transparent 50%,
                    transparent 100%
                  )
                `,
          maskImage: `
                  linear-gradient(
                    to bottom,
                    #000 0%,
                    rgba(0,0,0,.85) 10%,
                    rgba(0,0,0,.55) 20%,
                    rgba(0,0,0,.25) 30%,
                    transparent 50%,
                    transparent 100%
                  )
                `,
        }}
      >
        <Image
          src="/bgt.png"
          alt="Background"
          width={1920}
          height={300}
          priority
          className="w-full h-auto"
        />
      </div>

      {/* Overlay */}
      <div
        className="
                absolute
                inset-0
                z-10
                pointer-events-none
                bg-[#dddde9]
                dark:bg-dark transition-colors
              "
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to top, #000 0%, #000 45%, rgba(0,0,0,.85) 60%, rgba(0,0,0,.45) 78%, rgba(0,0,0,.15) 92%, transparent 100%)",
        }}
      />

      {/* Noise */}
      <div
        className="
                absolute 
                inset-0 
                z-20 
                pointer-events-none 
                opacity-20 
                mix-blend-overlay
              "
        style={{
          backgroundImage: "url('/grian.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
        }}
      />

      {/* Navbar Wrapper */}
      <div className="relative z-[100] w-full pointer-events-auto">
        <HeroNavbar />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-start mt-12 sm:mt-43 px-5 sm:px-6 w-full max-w-5xl mx-auto">
        {/* Refer & Earn Pill Button */}
        <button
          className="
            mb-8
            inline-flex
            items-center
            gap-2
            px-5 
            py-2.5 
            rounded-full 
            bg-[#f1f1f7]
            text-sm 
            font-medium 
            text-gray-700 
            hover:bg-gray-50 
            hover:shadow-md
            transition-all
            cursor-pointer
          "
        >
          Kabar Kukar
          <svg
            className="w-3 h-3 text-violet-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </button>

        {/* Heading */}
        <h1
          className="
            text-2xl
            sm:text-4xl
            md:text-5xl
            font-semibold
            text-[#111111]
            dark:text-white
            tracking-tight
            text-center
          "
        >
          Berita Terkini
        </h1>

        {/* Subtitle */}
        <p
          className="
            mt-5
            text-center
            text-zinc-600
            dark:text-zinc-400
            max-w-2xl
            text-base
            sm:text-lg
            md:text-xl
          "
        >
          Temukan berita terbaru dan terpopuler seputar UMKM Kutai Kartanegara
        </p>

        {/* Search Bar Container */}

        <NewsSearch
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
        />
      </div>
    </section>
  );
}
