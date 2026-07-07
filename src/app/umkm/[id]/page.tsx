import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import UmkmDetail from "@/components/Umkm/UmkmDetail";
import { umkms } from "@/data/umkm";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UmkmPage({ params }: Props) {
  const { id } = await params;
  const umkm = umkms.find((item) => item.id === Number(id));

  if (!umkm) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mt-20 relative z-10">
        <UmkmDetail {...umkm} />
      </main>

      <Footer />
    </div>
  );
}
