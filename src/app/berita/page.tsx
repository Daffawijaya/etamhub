import Footer from "@/components/Footer";
import FooterBrand from "@/components/FooterBrand";
import Navbar from "@/components/navbar/Navbar";
import HeroBackground from "@/components/news/HeroNews";
import NewsList from "@/components/news/NewsList";
import { getNews } from "@/lib/news/news.service";

export default async function BeritaPage() {
  const news = await getNews();

  const publishedNews = news.filter((item) => item.published);

  return (
    <>
      <Navbar />

      <main className="bg-light-bg dark:bg-dark overflow-hidden transition-colors">
        <HeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <NewsList data={publishedNews} />
        </div>

        <Footer
          title={<>Informasi terbaru UMKM Kutai Kartanegara bersama etamhub.</>}
        />

        <FooterBrand />
      </main>
    </>
  );
}
