import { supabaseAdmin } from "@/lib/supabaseAdmin";
import MapLoader from "@/components/map/MapLoader";

export default async function Page() {
  const { data: umkms, error } = await supabaseAdmin.from("umkm").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full h-screen">
      <MapLoader umkms={umkms ?? []} />
    </div>
  );
}
