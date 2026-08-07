import NewsCard from "./NewsCard";

import type { News } from "@/types/news";

type Props = {
  data: News[];
};

export default function NewsList({ data }: Props) {
  if (!data.length) {
    return (
      <div className="py-10 text-center text-gray-500">Belum ada berita.</div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
}
