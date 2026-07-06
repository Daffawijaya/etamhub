import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import UmkmDetail from "@/components/UmkmDetail";
import { umkms } from "@/data/umkm";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function UmkmPage({ params }: Props) {
  const { slug } = await params;

  const umkm = umkms.find((item) => item.slug === slug);

  if (!umkm) {
    notFound();
  }

  return (
     <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-6 py-10 mt-20">
        <UmkmDetail {...umkm} />
      </main>
    </div>
  );
}
