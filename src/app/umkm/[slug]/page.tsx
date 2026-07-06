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
    <div className="min-h-screen">
      <Navbar />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-400/15 blur-3xl" />

        <div className="absolute top-[400px] right-0 w-[600px] h-[600px] rounded-full bg-blue-400/15 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-400/15 blur-3xl" />
      </div>
      <main className="w-full max-w-7xl mx-auto px-6 py-10 mt-20">
        <UmkmDetail {...umkm} />
      </main>
    </div>
  );
}
