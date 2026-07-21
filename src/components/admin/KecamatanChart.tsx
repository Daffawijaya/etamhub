"use client";

import umkms from "@/data/umkm.json";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function KecamatanChart() {
  const data = Object.entries(
    umkms.reduce(
      (acc, item) => {
        acc[item.kecamatan] =
          (acc[item.kecamatan] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .map(([kecamatan, total]) => ({
      kecamatan,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#181818]">
      <h2 className="mb-1 text-xl font-semibold text-black dark:text-white">
        UMKM per Kecamatan
      </h2>

      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Top 10 kecamatan dengan jumlah UMKM terbanyak
      </p>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="kecamatan"
              tick={{ fontSize: 12 }}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#1184CA"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}