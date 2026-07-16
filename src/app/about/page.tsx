"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { teamMembers } from "@/data/team";
import { TeamSection } from "@/components/about";
import TeamStats from "@/components/about/TeamStats";
import Hero from "@/components/about/Hero";
import AboutPlatformSection from "@/components/about/AboutPlatformSection";
import UmkmTerbaruSection from "@/components/about/UmkmTerbaru";
import VisiManfaat from "@/components/about/VisiManfaat";
import SectionHeader from "@/components/textBlock/SectionHeader";
import FooterBrand from "@/components/FooterBrand";

const getTeamByBidang = (bidang: string) =>
  teamMembers.filter((item) => item.bidang === bidang);

const pimpinan = getTeamByBidang("Pimpinan");
const pendampingTI = getTeamByBidang("TI dan Digitalisasi");
const basisData = getTeamByBidang("Basis Data");
const kewirausahaan = getTeamByBidang("Kewirausahaan");
const lapangan = getTeamByBidang("Pendamping Lapangan");

const tabs = [
  "Pimpinan",
  "TI & Digitalisasi",
  "Kewirausahaan",
  "Basis Data",
  "Lapangan",
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("TI & Digitalisasi");

  return (
    <>
      <Navbar />

      <main className="bg-dark overflow-hidden">
        <Hero />
        <AboutPlatformSection />
        <UmkmTerbaruSection />
        <VisiManfaat />

        {/* STATS */}
        <section className="py-10 sm:py-14 md:py-24 text-center bg-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-5">
            <SectionHeader
              title="Tim Tenaga Ahli Pendamping UMKM"
              description="Dinas Koperasi dan UKM Kutai Kartanegara"
            />

            <div className="mt-8 sm:mt-10 md:mt-14">
              <TeamStats />
            </div>
          </div>
        </section>


        {/* TEAM TAB */}
        <div className="bg-dark pb-10 sm:pb-16 md:pb-24">

          {/* TAB MENU */}
          <div
            className="
              max-w-7xl 
              mx-auto 
              px-4 sm:px-5 md:px-6
              flex 
              justify-center
              mb-8 sm:mb-10 md:mb-16
            "
          >
            <div
              className="
                inline-flex
                bg-white/[0.04]
                border
                border-white/10
                backdrop-blur-xl
                rounded-lg sm:rounded-xl
                p-1
                gap-1
                overflow-x-auto
                max-w-full
                scrollbar-hide
              "
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-2.5 py-1.5
                    sm:px-3 sm:py-2
                    md:px-6 md:py-3
                    
                    rounded-md sm:rounded-lg

                    text-[11px]
                    sm:text-xs
                    md:text-base

                    font-medium
                    whitespace-nowrap
                    transition-all
                    duration-300

                    ${
                      activeTab === tab
                        ? "bg-white text-[#121313] shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>


          {/* CONTENT */}
          {activeTab === "Pimpinan" && (
            <TeamSection title="Pimpinan" members={pimpinan} />
          )}

          {activeTab === "TI & Digitalisasi" && (
            <TeamSection title="TI & Digitalisasi" members={pendampingTI} />
          )}

          {activeTab === "Kewirausahaan" && (
            <TeamSection title="Kewirausahaan" members={kewirausahaan} />
          )}

          {activeTab === "Basis Data" && (
            <TeamSection title="Basis Data" members={basisData} />
          )}

          {activeTab === "Lapangan" && (
            <TeamSection title="Pendamping Lapangan" members={lapangan} />
          )}
        </div>


        <Footer
          title={
            <>
              Bersama etamhub, dukung UMKM lokal untuk tumbuh dan berkembang
            </>
          }
        />

        <FooterBrand />
      </main>
    </>
  );
}