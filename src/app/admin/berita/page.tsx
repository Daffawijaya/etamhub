import Link from "next/link";

import { getNews } from "@/lib/news/news.service";

export default async function AdminBeritaPage() {
  const news = await getNews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Berita</h1>

        <Link
          href="/admin/berita/tambah"
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Tambah Berita
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.title}</td>

                <td className="p-3">{item.category ?? "-"}</td>

                <td className="p-3">
                  {item.published ? "Published" : "Draft"}
                </td>

                <td className="space-x-3 p-3">
                  <Link
                    href={`/admin/berita/edit/${item.id}`}
                    className="text-primary"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
