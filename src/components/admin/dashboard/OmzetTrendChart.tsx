"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    month: string;
    avgOmzet: number;
    totalOmzet: number;
    jumlahEntry: number;
  }[];
}

function formatRupiah(value: number) {
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
  return `Rp${value}`;
}

export default function OmzetTrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
        <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">
          Tren Omzet Rata-rata
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          Belum ada data omzet dari monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">
            Tren Omzet Rata-rata
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
            Rata-rata omzet per bulan dari data monitoring
          </p>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="omzetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1184CA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1184CA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-white/5"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatRupiah}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              formatter={(value: any) => [formatRupiah(Number(value)), "Rata-rata Omzet"]}
              contentStyle={{
                backgroundColor: "#1b1b1b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="avgOmzet"
              stroke="#1184CA"
              strokeWidth={3}
              dot={{ fill: "#1184CA", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: "#1184CA", strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
