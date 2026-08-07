import { notFound } from "next/navigation";

import NewsForm from "@/components/news/NewsForm";
import { getNewsById } from "@/lib/news/news.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBeritaPage({ params }: Props) {
  const { id } = await params;

  try {
    const news = await getNewsById(id);

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold">Edit Berita</h1>

        <NewsForm initialData={news} />
      </div>
    );
  } catch {
    notFound();
  }
}
