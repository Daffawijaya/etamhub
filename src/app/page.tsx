import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "etamhub — Katalog UMKM Kutai Kartanegara",
  description:
    "Temukan UMKM, produk, dan layanan dari seluruh kecamatan di Kutai Kartanegara. Jelajahi peta interaktif, berita terbaru, dan profil usaha lokal.",
  openGraph: {
    title: "etamhub — Katalog UMKM Kutai Kartanegara",
    description:
      "Temukan UMKM, produk, dan layanan dari seluruh kecamatan di Kutai Kartanegara.",
    type: "website",
    locale: "id_ID",
  },
};
import StatsSection from "@/components/dashboard/StatsSection";
import DistrictSection from "@/components/dashboard/DistrictSection";
import Footer from "@/components/Footer";
import Hero from "@/components/dashboard/Hero";
import InsightSection from "@/components/dashboard/InsightSection";
import FooterBrand from "@/components/FooterBrand";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-dark transition-colors">
        <Hero />

        <div className="relative">
          {/* Content */}
          <div className="relative z-10">
            <StatsSection />
            <InsightSection />
            <DistrictSection />
          </div>
        </div>
      </main>

      <Footer
        title={
          <>
            Potensi lokal dari setiap kecamatan tersaji dalam satu ekosistem
            digital
          </>
        }
      />
      <FooterBrand />
    </>
  );
}
