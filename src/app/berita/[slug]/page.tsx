import { notFound } from "next/navigation";

import NewsDetail from "@/components/news/NewsDetail";
import { getNewsBySlug } from "@/lib/news/news.service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const news = await getNewsBySlug(slug);

    return (
      <main className="container mx-auto px-4 py-10">
        <NewsDetail news={news} />
      </main>
    );
  } catch {
    notFound();
  }
}
