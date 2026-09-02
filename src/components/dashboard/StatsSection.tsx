import { supabase } from "@/lib/supabase";
import StatsAnimated from "./StatsAnimated";
export const dynamic = "force-dynamic";

export default async function StatsSection() {
  const { data: umkms, error } = await supabase
    .from("umkm")
    .select("kecamatan, subkategori")
    .eq("published", true);
  if (error) {
    throw new Error(error.message);
  }

  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  const totalSubkategori = new Set(umkms.map((item) => item.subkategori)).size;

  const stats = [
    {
      value: totalKecamatan,
      label: "Kecamatan",
      desc: "Wilayah yang telah bergabung",
    },
    {
      value: totalUmkm,
      label: "UMKM",
      desc: "Usaha yang terdaftar",
    },
    {
      value: totalSubkategori,
      label: "Subkategori",
      desc: "Ragam bidang usaha",
    },
  ];

  return <StatsAnimated stats={stats} />;
}
