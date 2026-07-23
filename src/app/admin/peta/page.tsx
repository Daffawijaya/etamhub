import { supabase } from "@/lib/supabase";
import MapLoader from "@/components/map/MapLoader";

export default async function Page() {
  const { data: umkms, error } = await supabase.from("umkm").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full h-screen">
      <MapLoader umkms={umkms ?? []} />
    </div>
  );
}
