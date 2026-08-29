"use client";

import { useEffect, useState } from "react";
import LoadingState from "@/components/LoadingState";
import { Save, RotateCcw } from "lucide-react";
import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";

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
  silver_label: "Tumbuh",
  gold_label: "Berkembang",
  platinum_label: "Naik Kelas",
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDisplayNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

function parseFormattedNumber(input: string): number {
  const cleaned = input.replace(/[^\d]/g, "");
  return cleaned === "" ? 0 : Number(cleaned);
}

type TierKey = "pemula" | "silver" | "gold" | "platinum";

const TIERS: {
  key: TierKey;
  icon: React.ReactNode;
  name: string;
  description: string;
  tagBg?: string;
  tagText?: string;
  tagLabel?: string;
  fields?: { key: keyof BadgeCriteria; label: string; prefix?: string; suffix?: string }[];
}[] = [
  {
    key: "pemula",
    icon: <SeedlingIcon className="h-8 w-8" />,
    name: "Pemula",
    description: "Sudah mulai monitoring (minimal 1 kunjungan) — otomatis",
    tagBg: "bg-amber-100 dark:bg-amber-900/30",
    tagText: "text-amber-600 dark:text-amber-400",
    tagLabel: "Otomatis",
  },
  {
    key: "silver",
    icon: <SilverMedalIcon className="h-8 w-8" />,
    name: "Tumbuh",
    description: "Sudah mulai menunjukkan perkembangan",
    fields: [
      { key: "silver_omzet_min", label: "Minimal Omzet", prefix: "Rp" },
      { key: "silver_tk_min", label: "Minimal Karyawan" },
      { key: "silver_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)" },
      { key: "silver_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (IG/FB/TT)" },
    ],
  },
  {
    key: "gold",
    icon: <GoldMedalIcon className="h-8 w-8" />,
    name: "Berkembang",
    description: "UMKM yang sudah berkembang pesat",
    fields: [
      { key: "gold_omzet_min", label: "Minimal Omzet", prefix: "Rp" },
      { key: "gold_tk_min", label: "Minimal Karyawan" },
      { key: "gold_legalitas_min", label: "Minimal Legalitas", suffix: "Jenis (Halal/PIRT/HAKI/NIB)" },
      { key: "gold_sosmed_min", label: "Minimal Sosmed Aktif", suffix: "Platform (IG/FB/TT)" },
    ],
  },
  {
    key: "platinum",
    icon: <DiamondIcon className="h-8 w-8" />,
    name: "Naik Kelas",
    description: "Tertinggi — semua kriteria terpenuhi",
    tagBg: "bg-purple-100 dark:bg-purple-900/30",
    tagText: "text-purple-600 dark:text-purple-400",
    tagLabel: "Tertinggi",
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
    <div className="pb-6 px-6">
      <div className="rounded-xl bg-white transition-colors duration-300 dark:bg-dark-card">
        {/* Header — matches berita page style */}
        <div className="px-6 pt-5 pb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Pengaturan Badge
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
              Atur kriteria untuk setiap tingkatan badge
            </p>
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

        {/* Badge tiers */}
        <div className="px-6 pb-6 space-y-4">
          {TIERS.map((tier) => {
            const isTopBadge = tier.key === "platinum";

            return (
              <div
                key={tier.key}
                className={`rounded-xl border p-5 transition-colors duration-300 ${
                  isTopBadge
                    ? "border-purple-200/60 bg-purple-50/50 dark:border-purple-800/40 dark:bg-purple-950/20"
                    : "border-slate-200 bg-slate-50 dark:border-white/[0.06] dark:bg-white/[0.02]"
                }`}
              >
                {/* Tier header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center">
                    {tier.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{tier.name}</h3>
                      {tier.tagLabel && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tier.tagBg} ${tier.tagText}`}>
                          {tier.tagLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>
                  </div>
                </div>

                {/* Fields */}
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
                            type="text"
                            inputMode="numeric"
                            value={formatDisplayNumber(criteria[field.key] as number)}
                            onChange={(e) => updateField(field.key, parseFormattedNumber(e.target.value))}
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white"
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
                {tier.key === "pemula" && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Badge ini diberikan otomatis ketika UMKM sudah memiliki minimal 1 kunjungan monitoring. Tidak perlu dikonfigurasi.
                  </p>
                )}
              </div>
            );
          })}

          {/* Ringkasan */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors duration-300 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Ringkasan Kriteria</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  <SeedlingIcon className="h-3 w-3" /> Pemula
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Minimal 1 kunjungan monitoring — otomatis
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <SilverMedalIcon className="h-3 w-3" /> Tumbuh
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Omzet ≥ Rp{formatRupiah(criteria.silver_omzet_min)}, TK ≥ {criteria.silver_tk_min}
                  {criteria.silver_legalitas_min > 0 && `, Legalitas ≥ ${criteria.silver_legalitas_min}`}
                  {criteria.silver_sosmed_min > 0 && `, Sosmed ≥ ${criteria.silver_sosmed_min}`}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  <GoldMedalIcon className="h-3 w-3" /> Berkembang
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Omzet ≥ Rp{formatRupiah(criteria.gold_omzet_min)}, TK ≥ {criteria.gold_tk_min}
                  {criteria.gold_legalitas_min > 0 && `, Legalitas ≥ ${criteria.gold_legalitas_min}`}
                  {criteria.gold_sosmed_min > 0 && `, Sosmed ≥ ${criteria.gold_sosmed_min}`}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                  <DiamondIcon className="h-3 w-3" /> Naik Kelas
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
    </div>
  );
}
