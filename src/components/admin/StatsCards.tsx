import {
  Building2,
  MapPinned,
  BriefcaseBusiness,
  CalendarPlus,
} from "lucide-react";

import StatCard from "./StatCard";

import umkms from "@/data/umkm.json";

export default function StatsCards() {
  const totalUmkm = umkms.length;

  const totalKecamatan = new Set(umkms.map((item) => item.kecamatan)).size;

  const totalSubkategori = new Set(umkms.map((item) => item.subkategori)).size;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const ditambahBulanIni = umkms.filter((item) => {
    if (!item.createdAt) return false;

    const date = new Date(item.createdAt);

    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const stats = [
    {
      title: "Total UMKM",
      value: totalUmkm,
      color: "#1184CA",
      icon: <Building2 size={22} />,
    },
    {
      title: "Total Kecamatan",
      value: totalKecamatan,
      color: "#844EC0",
      icon: <MapPinned size={22} />,
    },
    {
      title: "Subkategori",
      value: totalSubkategori,
      color: "#CA3785",
      icon: <BriefcaseBusiness size={22} />,
    },
    {
      title: "Ditambah Bulan Ini",
      value: ditambahBulanIni,
      color: "#F59E0B",
      icon: <CalendarPlus size={22} />,
    },
  ];

  return (
    <section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            color={item.color}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}
