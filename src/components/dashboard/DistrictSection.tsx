import { supabase } from "@/lib/supabase";
import DistrictAnimated from "./DistrictAnimated";

export default async function DistrictSection() {
  const { data: umkms, error } = await supabase
    .from("umkm")
    .select("kecamatan")
    .eq("published", true)
  if (error) {
    throw new Error(error.message);
  }

  const districtMap = (umkms || []).reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;
      return acc;
    },
    {},
  );

  const districts = Object.keys(districtMap).sort((a, b) =>
    a.localeCompare(b, "id", { sensitivity: "base" }),
  );

  return <DistrictAnimated districtMap={districtMap} districts={districts} />;
}
