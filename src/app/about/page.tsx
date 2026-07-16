"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { teamMembers } from "@/data/team";
import { TeamSection } from "@/components/about";
import AboutSection from "@/components/AboutSection";
import TeamStats from "@/components/about/TeamStats";
import Hero from "@/components/about/Hero";

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
      <Hero />
      <Footer />
    </>
  );
}
