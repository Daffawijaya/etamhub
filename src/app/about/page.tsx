import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/about/Hero";
import AboutPlatformSection from "@/components/about/AboutPlatformSection";
import UmkmTerbaruSection from "@/components/about/UmkmTerbaru";
import VisiManfaat from "@/components/about/VisiManfaat";
import AboutTeamTabs from "@/components/about/AboutTeamTabs";
import FooterBrand from "@/components/FooterBrand";

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
