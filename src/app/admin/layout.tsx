import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      <aside className="w-64 bg-zinc-900 text-white p-6">

        <h1 className="text-2xl font-bold mb-8">
          EtamHub Admin
        </h1>

        <nav className="space-y-2">

          <Link
            href="/admin"
            className="block px-4 py-2 rounded hover:bg-zinc-800"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/umkm"
            className="block px-4 py-2 rounded hover:bg-zinc-800"
          >
            Data UMKM
          </Link>

          <Link
            href="/admin/tambah"
            className="block px-4 py-2 rounded hover:bg-zinc-800"
          >
            Tambah UMKM
          </Link>

        </nav>

      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}