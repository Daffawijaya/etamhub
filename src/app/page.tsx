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

      <main className="relative overflow-hidden bg-white">
        <Hero />

        <div className="relative">
          {/* Background blobs */}
          {/* <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-400/30 blur-3xl" />

            <div className="absolute top-[400px] right-0 w-[600px] h-[600px] rounded-full bg-blue-400/30 blur-3xl" />

            <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-400/15 blur-3xl" />
          </div> */}

          {/* Content */}
          <div className="relative z-10">
            <StatsSection />
            <AboutSection />
            <DistrictSection />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
