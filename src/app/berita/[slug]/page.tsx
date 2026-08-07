import { notFound } from "next/navigation";

import NewsDetail from "@/components/news/NewsDetail";
import NewsSidebar from "@/components/news/NewsSidebar";

import {
  getNewsBySlug,
  getNews,
  incrementNewsView,
} from "@/lib/news/news.service";

import FooterBrand from "@/components/FooterBrand";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import HeaderNews from "@/components/news/HeaderNews";
import NewsTrending from "@/components/news/NewsTrending";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const news = await getNewsBySlug(slug);

    await incrementNewsView(news.id);

    const allNews = await getNews();

    const sidebarNews = allNews
      .filter((item) => item.id !== news.id)
      .slice(0, 5);

    return (
      <>
        <Navbar />

        <main className="overflow-hidden bg-light-bg transition-colors dark:bg-dark">
          <HeaderNews />

          <div
            className="
              relative
              z-40
              mx-auto
              max-w-7xl
              px-4
              pb-24
              pt-30 px-6
            "
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              <NewsDetail news={news} />

              <div className="space-y-6">
                <NewsTrending data={sidebarNews} />

                <NewsSidebar data={sidebarNews} />
              </div>
            </div>
          </div>

          <Footer />

          <FooterBrand />
        </main>
      </>
    );
  } catch {
    notFound();
  }
}
