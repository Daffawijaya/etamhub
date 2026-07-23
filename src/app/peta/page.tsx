import { supabase } from "@/lib/supabase";
import UmkmMap from "@/components/map/UmkmMap";
import Navbar from "@/components/navbar/Navbar";

export default async function PetaPage() {
  const { data: umkms, error } = await supabase.from("umkm").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <>
      <div className="absolute z-90">
        <Navbar />
      </div>

      <main className="relative h-screen w-full z-0">
        <UmkmMap umkms={umkms ?? []} />
      </main>
    </>
  );
}
