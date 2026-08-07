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
      <div className="space-y-6 px-6 pb-6">
        <NewsForm initialData={news} />
      </div>
    );
  } catch {
    notFound();
  }
}
