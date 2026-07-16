import Navbar from "@/components/navbar/Navbar";
import StatsSection from "@/components/StatsSection";
import DistrictSection from "@/components/DistrictSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import InsightSection from "@/components/InsightSection";
import FooterBrand from "@/components/FooterBrand";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-dark">
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
            Potensi lokal dari setiap kecamatan 
           
            tersaji dalam satu ekosistem digital
          </>
        }
      />
      <FooterBrand />
    </>
  );
}
