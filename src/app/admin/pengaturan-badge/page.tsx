"use client";

import { useEffect, useState } from "react";
import LoadingState from "@/components/LoadingState";
import { Save, RotateCcw } from "lucide-react";

interface BadgeCriteria {
  silver_omzet_min: number;
  silver_tk_min: number;
  silver_legalitas_min: number;
  silver_sosmed_min: number;
  gold_omzet_min: number;
  gold_tk_min: number;
  gold_legalitas_min: number;
  gold_sosmed_min: number;
  platinum_omzet_min: number;
  platinum_tk_min: number;
  platinum_legalitas_min: number;
  platinum_sosmed_min: number;
  silver_label: string;
  gold_label: string;
  platinum_label: string;
}

const DEFAULTS: BadgeCriteria = {
  silver_omzet_min: 5000000,
  silver_tk_min: 1,
  silver_legalitas_min: 0,
  silver_sosmed_min: 0,
  gold_omzet_min: 10000000,
  gold_tk_min: 3,
  gold_legalitas_min: 1,
  gold_sosmed_min: 1,
  platinum_omzet_min: 25000000,
  platinum_tk_min: 5,
  platinum_legalitas_min: 2,
  platinum_sosmed_min: 2,
  silver_label: "🌿 Tumbuh",
  gold_label: "🌳 Berkembang",
  platinum_label: "💎 Naik Kelas",
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

type TierKey = "pemula" | "silver" | "gold" | "platinum";

const TIERS: {
  key: TierKey;
  icon: string;
  name: string;
  description: string;
  color: string;
  fields?: { key: keyof BadgeCriteria; label: string; prefix?: string; suffix?: string }[];
}[] = [
  {
    key: "pemula",
    icon: "🌱",
    name: "Pemula",
    description: "Sudah mulai monitoring (minimal 1 kunjungan) — otomatis",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    key: "silver",
    icon: "🌿",
    name: "Tumbuh",
    description: "Sudah mulai menunjukkan perkembangan",
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    fields: [
      { key: "silver_omzet_min", label: "Minimal Omzet", prefix: "Rp" },
      { key: "silver_tk_min", label: "Minimal Karyawan" },
      { key: "silver_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)" },
      { key: "silver_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (IG/FB/TT)" },
    ],
  },
  {
    key: "gold",
    icon: "🌳",
    name: "Berkembang",
    description: "UMKM yang sudah berkembang pesat",
    color: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
    fields: [
      { key: "gold_omzet_min", label: "Minimal Omzet", prefix: "Rp" },
      { key: "gold_tk_min", label: "Minimal Karyawan" },
      { key: "gold_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)" },
      { key: "gold_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (IG/FB/TT)" },
    ],
  },
  {
    key: "platinum",
    icon: "💎",
    name: "Naik Kelas",
    description: "Tertinggi — semua kriteria terpenuhi",
    color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    fields: [
      { key: "platinum_omzet_min", label: "Minimal Omzet", prefix: "Rp" },
      { key: "platinum_tk_min", label: "Minimal Karyawan" },
      { key: "platinum_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)" },
      { key: "platinum_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (IG/FB/TT)" },
    ],
  },
];

export default function PengaturanBadgePage() {
  const [criteria, setCriteria] = useState<BadgeCriteria>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/badge-criteria")
      .then((res) => res.json())
      .then((data) => {
        if (data.silver_omzet_min !== undefined) {
          setCriteria({ ...DEFAULTS, ...data, silver_label: data.silver_label ?? "", gold_label: data.gold_label ?? "", platinum_label: data.platinum_label ?? "" });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/badge-criteria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Gagal menyimpan kriteria badge");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setCriteria(DEFAULTS);
  }

  function updateField<K extends keyof BadgeCriteria>(field: K, value: BadgeCriteria[K]) {
    setCriteria((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) return <LoadingState />;

  return (
    <main className="px-6 pb-6">
      <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
        {/* Header with title + buttons */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Pengaturan Badge</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Atur kriteria untuk setiap tingkatan badge</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Menyimpan..." : saved ? "✓ Tersimpan" : "Simpan"}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {TIERS.map((tier) => {
            const isTopBadge = tier.key === "platinum";
            const isPemula = tier.key === "pemula";

            return (
              <div
                key={tier.key}
                className={`rounded-xl border p-5 ${
                  isTopBadge
                    ? "border-purple-200 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-900/10"
                    : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/30"
                }`}
              >
                {/* Tier header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg text-xl">{tier.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{tier.name}</h2>
                      {isTopBadge && (
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                          Tertinggi
                        </span>
                      )}
                      {isPemula && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                          Otomatis
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>
                  </div>
                </div>

                {/* Fields (editable tiers only) */}
                {tier.fields && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {tier.fields.map((field) => (
                      <div key={field.key}>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          {field.label}
                        </label>
                        <div className="flex items-center gap-1">
                          {field.prefix && <span className="text-sm text-slate-400">{field.prefix}</span>}
                          <input
                            type="number"
                            value={criteria[field.key] as number}
                            onChange={(e) => updateField(field.key, Number(e.target.value))}
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-dark dark:text-white"
                          />
                        </div>
                        {field.suffix && (
                          <p className="mt-1 text-xs text-slate-400">{field.suffix}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pemula info */}
                {isPemula && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Badge ini diberikan otomatis ketika UMKM sudah memiliki minimal 1 kunjungan monitoring. Tidak perlu dikonfigurasi.
                  </p>
                )}
              </div>
            );
          })}

          {/* Ringkasan */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Ringkasan Kriteria</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  🌱 Pemula
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Minimal 1 kunjungan monitoring — otomatis
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  🌿 Tumbuh
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Omzet ≥ Rp{formatRupiah(criteria.silver_omzet_min)}, TK ≥ {criteria.silver_tk_min}
                  {criteria.silver_legalitas_min > 0 && `, Legalitas ≥ ${criteria.silver_legalitas_min}`}
                  {criteria.silver_sosmed_min > 0 && `, Sosmed ≥ ${criteria.silver_sosmed_min}`}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  🌳 Berkembang
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Omzet ≥ Rp{formatRupiah(criteria.gold_omzet_min)}, TK ≥ {criteria.gold_tk_min}
                  {criteria.gold_legalitas_min > 0 && `, Legalitas ≥ ${criteria.gold_legalitas_min}`}
                  {criteria.gold_sosmed_min > 0 && `, Sosmed ≥ ${criteria.gold_sosmed_min}`}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                  💎 Naik Kelas
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Omzet ≥ Rp{formatRupiah(criteria.platinum_omzet_min)}, TK ≥ {criteria.platinum_tk_min}
                  {criteria.platinum_legalitas_min > 0 && `, Legalitas ≥ ${criteria.platinum_legalitas_min}`}
                  {criteria.platinum_sosmed_min > 0 && `, Sosmed ≥ ${criteria.platinum_sosmed_min}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
