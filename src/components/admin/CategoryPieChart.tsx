"use client";

import umkms from "@/data/umkm.json";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#1184CA", // Perdagangan
  "#844EC0", // Jasa
  "#F59E0B", // Industri
  "#10B981",
  "#EF4444",
];

export default function CategoryPieChart() {
  const data = Object.entries(
    umkms.reduce(
      (acc, item) => {
        acc[item.kategori] = (acc[item.kategori] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="h-[320px] rounded-[32px] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Kategori UMKM</h3>

      <div className="flex h-[240px] items-center">
        <div className="h-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-40 space-y-3">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-sm">{item.name}</span>
              </div>

              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
