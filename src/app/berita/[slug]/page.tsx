import { notFound } from "next/navigation";

import FooterBrand from "@/components/FooterBrand";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import HeaderNews from "@/components/news/HeaderNews";
import NewsDetail from "@/components/news/NewsDetail";
import NewsSidebar from "@/components/news/NewsSidebar";
import NewsTrending from "@/components/news/NewsTrending";

import {
  getNews,
  getNewsBySlug,
  incrementNewsView,
} from "@/lib/news/news.service";

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

    const newsResult = await getNews({
      page: 1,
      limit: 100,
    });

    const allNews = newsResult.data;

    const trendingIds = [...allNews]
      .filter((item) => item.id !== news.id)
      .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
      .slice(0, 3)
      .map((item) => item.id);

    const sidebarNews = allNews
      .filter((item) => item.id !== news.id && !trendingIds.includes(item.id))
      .sort((a, b) => {
        const aRelated = a.category === news.category;
        const bRelated = b.category === news.category;

        if (aRelated !== bRelated) {
          return aRelated ? -1 : 1;
        }

        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })
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
              pt-30
              sm:px-6
              lg:px-8
            "
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              <NewsDetail news={news} />

              <div className="space-y-6">
                <NewsTrending data={allNews} currentNewsId={news.id} />

                <NewsSidebar data={sidebarNews} currentNews={news} />
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
