import Navbar from "@/components/Navbar";
import StatsSection from "@/components/StatsSection";
import DistrictSection from "@/components/DistrictSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <Hero />
        <StatsSection />
        <AboutSection />
        <DistrictSection />
      </main>

      <Footer />
    </>
  );
}
