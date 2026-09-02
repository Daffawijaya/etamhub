"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { teamMembers } from "@/data/team";
import { TeamSection } from "@/components/about";
import TeamStats from "./TeamStats";
import SectionHeader from "../textBlock/SectionHeader";

const getTeamByBidang = (bidang: string) =>
  teamMembers.filter((item) => item.bidang === bidang);

const pimpinan = getTeamByBidang("Pimpinan");
const pendampingTI = getTeamByBidang("TI dan Digitalisasi");
const basisData = getTeamByBidang("Basis Data");
const kewirausahaan = getTeamByBidang("Kewirausahaan");
const lapangan = getTeamByBidang("Pendamping Lapangan");

const tabs = [
  "TI & Digitalisasi",
  "Kewirausahaan",
  "Basis Data",
  "Lapangan",
];

export default function AboutTeamTabs() {
  const [activeTab, setActiveTab] = useState("TI & Digitalisasi");

  return (
    <>
      {/* STATS */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-10 sm:py-14 md:py-24 text-center bg-light-bg dark:bg-dark transition-colors overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader
              title="Tim Tenaga Ahli Pendamping UMKM"
              description="Dinas Koperasi dan UKM Kutai Kartanegara"
            />
          </motion.div>

          <div className="mt-8 sm:mt-10 md:mt-14">
            <TeamStats />
          </div>
        </div>
      </motion.section>

      {/* TEAM TAB */}
      <div className="bg-light-bg dark:bg-dark pb-10 sm:pb-16 md:pb-24 transition-colors">
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
              dark:bg-white/[0.04]
              border
              border-white
              dark:border-white/10
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
                  relative
                  px-2.5 py-1.5
                  sm:px-3 sm:py-2
                  md:px-6 md:py-3

                  rounded-md sm:rounded-lg

                  text-[11px]
                  sm:text-xs
                  md:text-base

                  font-medium
                  whitespace-nowrap
                  transition-colors
                  duration-300

                  ${
                    activeTab === tab
                      ? "text-white dark:text-[#121313]"
                      : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                  }
                `}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab-about"
                    className="absolute inset-0 rounded-md sm:rounded-lg bg-[#121313] dark:bg-white shadow-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "Pimpinan" && (
            <motion.div key="pimpinan" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <TeamSection title="Pimpinan" members={pimpinan} />
            </motion.div>
          )}

          {activeTab === "TI & Digitalisasi" && (
            <motion.div key="ti" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <TeamSection title="TI & Digitalisasi" members={pendampingTI} />
            </motion.div>
          )}

          {activeTab === "Kewirausahaan" && (
            <motion.div key="wira" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <TeamSection title="Kewirausahaan" members={kewirausahaan} />
            </motion.div>
          )}

          {activeTab === "Basis Data" && (
            <motion.div key="basis" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <TeamSection title="Basis Data" members={basisData} />
            </motion.div>
          )}

          {activeTab === "Lapangan" && (
            <motion.div key="lapangan" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <TeamSection title="Pendamping Lapangan" members={lapangan} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
