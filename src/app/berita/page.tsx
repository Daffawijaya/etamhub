import Footer from "@/components/Footer";
import FooterBrand from "@/components/FooterBrand";
import HeroBackground from "@/components/news/HeroNews";
import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsPopular from "@/components/news/NewsPopular";
import { getNews, getTrendingNews } from "@/lib/news/news.service";
import Navbar from "@/components/navbar/Navbar";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function BeritaPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);

  const trending = await getTrendingNews(3);

  const result = await getNews({
    limit: 10,
    page,
    published: true,
    excludeIds: trending.map((item) => item.id),
  });

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-light-bg transition-colors dark:bg-dark">
        <HeroBackground />

        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <NewsPopular data={trending} />

          <div className="mt-12">
            <NewsList data={result.data} />
          </div>

          <div className="flex justify-center">
            <Pagination
              page={result.pagination.page}
              totalPages={result.pagination.totalPages}
            />
          </div>
        </div>

        <Footer
          title={<>Informasi terbaru UMKM Kutai Kartanegara bersama etamhub.</>}
        />

        <FooterBrand />
      </main>
    </>
  );
}
