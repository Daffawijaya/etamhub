"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  monitoredCount?: number;
  totalUmkm?: number;
}

const RADIAN = Math.PI / 180;

function renderCustomLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (!percent || percent < 0.05) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-((midAngle ?? 0) * RADIAN));
  const y = cy + radius * Math.sin(-((midAngle ?? 0) * RADIAN));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function BadgePieChart({ data, monitoredCount, totalUmkm }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
      <div className="rounded-xl bg-[#1b1b1b] px-4 py-3 shadow-xl ring-1 ring-white/10">
        <p className="text-sm font-medium text-white">{item.name}</p>
        <p className="text-xs text-slate-400">
          {item.value} UMKM ({((item.value / (total || 1)) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">
          Distribusi Badge
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
          Status badge UMKM yang sudah dipantau
        </p>
      </div>

      {total === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          Belum ada data badge.
        </p>
      ) : (
        <>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Dipantau</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {monitoredCount ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total UMKM</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {totalUmkm ?? 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
