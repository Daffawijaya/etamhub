import NewsList from "@/components/news/NewsList";
import { getNews } from "@/lib/news/news.service";

export default async function BeritaPage() {
  const news = await getNews();

  const publishedNews = news.filter((item) => item.published);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Berita</h1>

        <p className="mt-2 text-gray-600">
          Informasi terbaru seputar UMKM dan kegiatan daerah.
        </p>
      </div>

      <NewsList data={publishedNews} />
    </main>
  );
}
