"use client";

import { useMemo, useState } from "react";
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
  points: {
    t: string;
    omzet: number;
    umkm_id?: string;
  }[];
}

type RangeKey = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
type Granularity = "hour" | "day" | "month" | "year";

const RANGES: { key: RangeKey; label: string; slots?: number; granularity: Granularity; per: string; desc: string }[] = [
  { key: "1D", label: "1D", slots: 24, granularity: "hour", per: "per jam", desc: "1 hari terakhir" },
  { key: "1W", label: "1W", slots: 7, granularity: "day", per: "per hari", desc: "1 minggu terakhir" },
  { key: "1M", label: "1M", slots: 30, granularity: "day", per: "per hari", desc: "1 bulan terakhir" },
  { key: "3M", label: "3M", slots: 90, granularity: "day", per: "per hari", desc: "3 bulan terakhir" },
  { key: "1Y", label: "1Y", slots: 12, granularity: "month", per: "per bulan", desc: "1 tahun terakhir" },
  { key: "ALL", label: "Semua", granularity: "month", per: "per bulan", desc: "seluruh data" },
];

const MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const PER_LABEL: Record<Granularity, string> = {
  hour: "per jam",
  day: "per hari",
  month: "per bulan",
  year: "per tahun",
};

// Granularitas adaptif untuk range Semua: jaga jumlah slot tetap enak dibaca.
function spanGranularity(spanMs: number): Granularity {
  const days = spanMs / (24 * 3600 * 1000);
  if (days <= 1) return "hour";
  if (days <= 186) return "day";
  if (days <= 1826) return "month";
  return "year";
}
const pad = (n: number) => String(n).padStart(2, "0");

function bucketKey(time: number, g: Granularity) {
  const d = new Date(time);
  const y = d.getFullYear();
  if (g === "year") return { key: `${y}`, label: `${y}` };
  const m = pad(d.getMonth() + 1);
  if (g === "hour") return { key: `${y}-${m}-${pad(d.getDate())} ${pad(d.getHours())}`, label: `${pad(d.getHours())}:00` };
  if (g === "day") return { key: `${y}-${m}-${pad(d.getDate())}`, label: `${d.getDate()} ${MON_SHORT[d.getMonth()]}` };
  return { key: `${y}-${m}`, label: `${MON_SHORT[d.getMonth()]} ${String(y).slice(2)}` };
}

function floorBucket(time: number, g: Granularity) {
  const d = new Date(time);
  if (g === "year") {
    d.setMonth(0, 1);
    d.setHours(0, 0, 0, 0);
  } else if (g === "hour") d.setMinutes(0, 0, 0);
  else if (g === "day") d.setHours(0, 0, 0, 0);
  else {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

function stepBack(d: Date, g: Granularity, n: number) {
  const c = new Date(d);
  if (g === "year") c.setFullYear(c.getFullYear() - n);
  else if (g === "hour") c.setHours(c.getHours() - n);
  else if (g === "day") c.setDate(c.getDate() - n);
  else c.setMonth(c.getMonth() - n);
  return c;
}

function formatRupiah(value: number) {
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
  return `Rp${value}`;
}

export default function OmzetTrendChart({ points }: Props) {
  const [range, setRange] = useState<RangeKey>("ALL");
  const cfg = RANGES.find((r) => r.key === range)!;

  const times = useMemo(() => {
    return points
      .map((p) => ({ time: new Date(p.t).getTime(), omzet: p.omzet }))
      .filter((p) => Number.isFinite(p.time) && p.omzet > 0)
      .sort((a, b) => a.time - b.time);
  }, [points]);

  // Semua: granularitas ikut bentang data. Range lain: tetap sesuai tabel.
  const gran: Granularity =
    range === "ALL" && times.length > 1
      ? spanGranularity(times[times.length - 1].time - times[0].time)
      : cfg.granularity;

  const chartData = useMemo(() => {
    if (times.length === 0) return [];
    const anchor = times[times.length - 1].time;
    // Grid pas sejumlah slot. Window 1D..1Y berakhir di SEKARANG (kanan = kini).
    // Semua: dari bucket titik pertama sampai terakhir.
    const endB =
      range === "ALL" ? floorBucket(anchor, gran) : floorBucket(Date.now(), gran);
    const gridStart =
      range === "ALL"
        ? floorBucket(times[0].time, gran)
        : stepBack(endB, gran, (cfg.slots ?? 12) - 1);
    const startT = gridStart.getTime();
    const buckets = new Map<string, { label: string; total: number; count: number }>();
    for (const p of times) {
      if (p.time < startT || p.time > anchor) continue;
      const b = bucketKey(p.time, gran);
      const cur = buckets.get(b.key) ?? { label: b.label, total: 0, count: 0 };
      cur.total += p.omzet;
      cur.count++;
      buckets.set(b.key, cur);
    }
    // Grid penuh selebar window (ala saham): slot kosong = null (gap), bukan dihilangkan.
    const slots: { month: string; avgOmzet: number | null }[] = [];
    const cursor = new Date(gridStart);
    const endT = endB.getTime();
    while (cursor.getTime() <= endT) {
      const b = bucketKey(cursor.getTime(), gran);
      const agg = buckets.get(b.key);
      slots.push({ month: b.label, avgOmzet: agg ? Math.round(agg.total / agg.count) : null });
      if (gran === "hour") cursor.setHours(cursor.getHours() + 1);
      else if (gran === "day") cursor.setDate(cursor.getDate() + 1);
      else if (gran === "year") cursor.setFullYear(cursor.getFullYear() + 1);
      else cursor.setMonth(cursor.getMonth() + 1);
    }
    // Nilai awal dari data sebelum window: garis flat dari tepi kiri (ala 1D).
    let last: number | null = null;
    for (let i = times.length - 1; i >= 0; i--) {
      if (times[i].time < startT) {
        last = times[i].omzet;
        break;
      }
    }
    for (const s of slots) {
      if (s.avgOmzet != null) last = s.avgOmzet;
      else if (last != null) s.avgOmzet = last;
    }
    return slots;
  }, [times, range, cfg, gran]);

  // Nilai terisi (abaikan gap) untuk warna tren & status kosong
  const vals = chartData.map((d) => d.avgOmzet).filter((v): v is number => v != null);

  // Hijau kalau tren naik, merah kalau turun (bandingkan titik terakhir vs pertama yg tampil)
  const trendColor =
    vals.length < 2
      ? "#1184CA"
      : vals[vals.length - 1] >= vals[0]
        ? "#10B981"
        : "#EF4444";

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">
            Tren Omzet Rata-rata
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
            Rata-rata omzet {range === "ALL" ? PER_LABEL[gran] : cfg.per} · {cfg.desc}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                range === r.key
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {times.length === 0 || vals.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          {times.length === 0
            ? "Belum ada data omzet dari monitoring."
            : "Tidak ada data omzet pada rentang ini."}
        </p>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="omzetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trendColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
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
                minTickGap={24}
              />
              <YAxis
                tickFormatter={formatRupiah}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={70}
                domain={[(dataMin: number) => Math.floor(dataMin * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              />
              <Tooltip
                formatter={(value: any) =>
                  value == null ? ["—", "Rata-rata Omzet"] : [formatRupiah(Number(value)), "Rata-rata Omzet"]
                }
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
                connectNulls
                stroke={trendColor}
                strokeWidth={3}
                dot={vals.length < 2 ? { fill: trendColor, strokeWidth: 0, r: 4 } : false}
                activeDot={{ r: 5, stroke: trendColor, strokeWidth: 2, fill: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
