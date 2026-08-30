import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/about/Hero";
import AboutPlatformSection from "@/components/about/AboutPlatformSection";
import UmkmTerbaruSection from "@/components/about/UmkmTerbaru";
import VisiManfaat from "@/components/about/VisiManfaat";
import AboutTeamTabs from "@/components/about/AboutTeamTabs";
import FooterBrand from "@/components/FooterBrand";

export const metadata: Metadata = {
  title: "Tentang EtamHub",
  description:
    "EtamHub adalah platform digital katalog UMKM Kutai Kartanegara. Kenali visi, manfaat, dan tim di balik pengembangan ekosistem UMKM lokal.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Tentang EtamHub",
    description:
      "Platform digital katalog UMKM Kutai Kartanegara.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="bg-light-bg dark:bg-dark overflow-hidden transition-colors">
        <Hero />

        <AboutPlatformSection />

        <UmkmTerbaruSection />

        <VisiManfaat />

        <AboutTeamTabs />

        <Footer
          title={
            <>Bersama etamhub, dukung UMKM lokal untuk tumbuh dan berkembang</>
          }
        />

        <FooterBrand />
      </main>
    </>
  );
}
