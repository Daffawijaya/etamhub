"use client";

import umkms from "@/data/umkm.json";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function CategoryPieChart() {
  const jasa = umkms.filter((item) => item.kategori === "Jasa").length;

  const perdagangan = umkms.filter(
    (item) => item.kategori === "Perdagangan",
  ).length;

  const industri = umkms.filter((item) => item.kategori === "Industri").length;

  const data = [
    {
      name: "Jasa",
      value: jasa,
      color: "#844EC0",
    },
    {
      name: "Perdagangan",
      value: perdagangan,
      color: "#1184CA",
    },
    {
      name: "Industri",
      value: industri,
      color: "#F59E0B",
    },
  ];

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-[#181818]">
      <h2 className="mb-1 text-xl font-semibold text-black dark:text-white">
        Distribusi Kategori
      </h2>

      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Persentase kategori UMKM
      </p>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={4}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
