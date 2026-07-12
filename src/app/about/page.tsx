"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { teamMembers } from "@/data/team";
import { TeamSection } from "@/components/about";
import AboutSection from "@/components/AboutSection";

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

      <main className="bg-white overflow-hidden">
        {/* HERO */}
        {/* HERO */}
        <section className="bg-primary min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-5 md:px-6 py-20 lg:py-28">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-5xl">
                Mendukung Transformasi Digital UMKM Kutai Kartanegara
              </h1>

              <p className="mt-6 md:mt-8 text-base md:text-lg text-white/80 leading-relaxed max-w-3xl">
                Platform digital yang dikembangkan oleh Tenaga Ahli Pendamping
                UMKM Kukar untuk memperkuat promosi, informasi, dan pengembangan
                usaha mikro di Kutai Kartanegara.
              </p>
            </div>
          </div>
        </section>

        {/* ETAMHUB */}
        <AboutSection />

        {/* STATS */}
        {/* STATS */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              Tim Pendamping KAWAKU
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mt-12 md:mt-20">
              <div>
                <h3 className="text-4xl md:text-6xl font-bold text-primary">
                  3
                </h3>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600">
                  TI & Digitalisasi
                </p>
              </div>

              <div>
                <h3 className="text-4xl md:text-6xl font-bold text-primary">
                  2
                </h3>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600">
                  Kewirausahaan
                </p>
              </div>

              <div>
                <h3 className="text-4xl md:text-6xl font-bold text-primary">
                  2
                </h3>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600">
                  Basis Data
                </p>
              </div>

              <div>
                <h3 className="text-4xl md:text-6xl font-bold text-primary">
                  13
                </h3>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600">
                  Pendamping Lapangan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM TAB */}
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          {/* TAB MENU */}
          <div className="flex justify-center mb-10 md:mb-16">
            <div
              className="
        inline-flex
        bg-slate-100
        rounded-xl md:rounded-2xl
        
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
                  className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-lg"
                      : "text-slate-700 hover:bg-white"
                  }`}
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
            <TeamSection
              title="Pendamping TI & Digitalisasi"
              members={pendampingTI}
            />
          )}

          {activeTab === "Kewirausahaan" && (
            <TeamSection
              title="Pendamping Kewirausahaan"
              members={kewirausahaan}
            />
          )}

          {activeTab === "Basis Data" && (
            <TeamSection title="Pendamping Basis Data" members={basisData} />
          )}

          {activeTab === "Lapangan" && (
            <TeamSection title="Pendamping Lapangan" members={lapangan} />
          )}
        </div>

        {/* CTA */}
        <section className="bg-primary py-20 md:py-28">
          <div className="max-w-5xl mx-auto text-center px-5">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Bersama Mendukung UMKM Kutai Kartanegara
            </h2>

            <p className="mt-5 md:mt-6 text-base md:text-xl text-white/80">
              Membangun ekosistem UMKM yang lebih kuat, inovatif, dan terhubung
              melalui transformasi digital.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
