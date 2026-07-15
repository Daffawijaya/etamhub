import Navbar from "@/components/Navbar";
import StatsSection from "@/components/StatsSection";
import DistrictSection from "@/components/DistrictSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import InsightSection from "@/components/InsightSection";
import FooterBrand from "@/components/FooterBrand";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-white">
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
            Temukan UMKM Lokal
            <br />
            Kutai Kartanegara
          </>
        }
      />
      <FooterBrand />
    </>
  );
}
