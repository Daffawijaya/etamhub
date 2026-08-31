"use client";

import { SeedlingIcon, SilverMedalIcon, GoldMedalIcon, DiamondIcon } from "@/components/icons/BadgeIcons";
import type { ReactNode } from "react";

type BadgeData = {
  level: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
  criteria: {
    omzet: number | null;
    tk: number | null;
    legalitas: number;
    sosmed: number;
    monitoringCount: number;
  };
};

type CriteriaConfig = {
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
};

type Props = {
  badge: BadgeData;
  criteriaConfig: CriteriaConfig;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function ProgressBar({
  current,
  target,
  label,
  format = "number",
}: {
  current: number;
  target: number;
  label: string;
  format?: "number" | "rupiah";
}) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const met = current >= target;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`font-medium ${met ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}>
          {format === "rupiah" ? formatRupiah(current) : current}
          {!met && (
            <span className="text-slate-400 dark:text-slate-500">
              {" / "}
              {format === "rupiah" ? formatRupiah(target) : target}
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            met
              ? "bg-green-500"
              : pct > 50
                ? "bg-amber-500"
                : "bg-slate-300 dark:bg-slate-600"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const BADGE_ICONS: Record<string, ReactNode> = {
  bronze: <SeedlingIcon className="h-4 w-4" />,
  silver: <SilverMedalIcon className="h-4 w-4" />,
  gold: <GoldMedalIcon className="h-4 w-4" />,
  platinum: <DiamondIcon className="h-4 w-4" />,
};

const BADGE_ICONS_LARGE: Record<string, ReactNode> = {
  bronze: <SeedlingIcon className="h-5 w-5" />,
  silver: <SilverMedalIcon className="h-5 w-5" />,
  gold: <GoldMedalIcon className="h-5 w-5" />,
  platinum: <DiamondIcon className="h-5 w-5" />,
};

const LEVEL_STYLES = {
  bronze: {
    reached: "bg-amber-50 dark:bg-amber-900/20",
    current: "bg-amber-100 ring-2 ring-amber-500 dark:bg-amber-900/30 dark:ring-amber-400 scale-110",
    icon: "text-amber-500 dark:text-amber-400",
    iconCurrent: "text-amber-600 dark:text-amber-400",
    line: "bg-amber-400 dark:bg-amber-500",
    lineGrad: "bg-gradient-to-r from-amber-400 to-slate-200 dark:from-amber-500 dark:to-slate-700",
  },
  silver: {
    reached: "bg-emerald-50 dark:bg-emerald-900/20",
    current: "bg-emerald-100 ring-2 ring-emerald-500 dark:bg-emerald-900/30 dark:ring-emerald-400 scale-110",
    icon: "text-emerald-500 dark:text-emerald-400",
    iconCurrent: "text-emerald-600 dark:text-emerald-400",
    line: "bg-emerald-400 dark:bg-emerald-500",
    lineGrad: "bg-gradient-to-r from-emerald-400 to-slate-200 dark:from-emerald-500 dark:to-slate-700",
  },
  gold: {
    reached: "bg-orange-50 dark:bg-orange-900/20",
    current: "bg-orange-100 ring-2 ring-orange-500 dark:bg-orange-900/30 dark:ring-orange-400 scale-110",
    icon: "text-orange-500 dark:text-orange-400",
    iconCurrent: "text-orange-600 dark:text-orange-400",
    line: "bg-orange-400 dark:bg-orange-500",
    lineGrad: "bg-gradient-to-r from-orange-400 to-slate-200 dark:from-orange-500 dark:to-slate-700",
  },
  platinum: {
    reached: "bg-purple-50 dark:bg-purple-900/20",
    current: "bg-purple-100 ring-2 ring-purple-500 dark:bg-purple-900/30 dark:ring-purple-400 scale-110",
    icon: "text-purple-500 dark:text-purple-400",
    iconCurrent: "text-purple-600 dark:text-purple-400",
    line: "bg-purple-400 dark:bg-purple-500",
    lineGrad: "bg-gradient-to-r from-purple-400 to-slate-200 dark:from-purple-500 dark:to-slate-700",
  },
} as const;

const levels: { key: keyof typeof LEVEL_STYLES; label: string; icon: ReactNode }[] = [
  { key: "bronze", label: "Pemula", icon: <SeedlingIcon className="h-4 w-4" /> },
  { key: "silver", label: "Tumbuh", icon: <SilverMedalIcon className="h-4 w-4" /> },
  { key: "gold", label: "Berkembang", icon: <GoldMedalIcon className="h-4 w-4" /> },
  { key: "platinum", label: "Naik Kelas", icon: <DiamondIcon className="h-4 w-4" /> },
];

const levelOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };

export default function BadgeProgressCard({ badge, criteriaConfig }: Props) {
  const currentIdx = levelOrder[badge.level as keyof typeof levelOrder] ?? 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card px-5 py-4 sm:p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        {badge.level !== "none" && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-2 shadow-sm dark:bg-dark-card ${badge.bgColor}`}>
            {BADGE_ICONS_LARGE[badge.level]}
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Kriteria Badge
          </h3>
          <p className="text-xs text-slate-400">
            {badge.label
              ? `${badge.label} · ${badge.criteria.monitoringCount}x monitoring`
              : "Belum ada badge"}
          </p>
        </div>
      </div>

      {/* Badge Level Stepper */}
      <div className="mb-5">
        <div className="flex items-center">
          {levels.map((lvl, idx) => {
            const isReached = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const s = LEVEL_STYLES[lvl.key];
            return (
              <div key={lvl.key} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                    isCurrent ? s.current : isReached ? s.reached : "bg-slate-100 dark:bg-white/5"
                  }`}>
                    <span className={isCurrent ? s.iconCurrent : isReached ? s.icon : "text-slate-400 dark:text-slate-600"}>
                      {lvl.icon}
                    </span>
                  </div>
                  <span className={`mt-1 text-[10px] font-medium ${
                    isCurrent ? s.iconCurrent : isReached ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-600"
                  }`}>
                    {lvl.label}
                  </span>
                </div>
                {idx < levels.length - 1 && (
                  <div className={`mx-1 h-0.5 flex-1 transition-all duration-300 ${
                    idx < currentIdx ? s.line : idx === currentIdx ? s.lineGrad : "bg-slate-200 dark:bg-slate-700"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        <ProgressBar
          current={badge.criteria.omzet ?? 0}
          target={criteriaConfig.platinum_omzet_min}
          label="Omzet"
          format="rupiah"
        />
        <ProgressBar
          current={badge.criteria.tk ?? 0}
          target={criteriaConfig.platinum_tk_min}
          label="Tenaga Kerja"
        />
        <ProgressBar
          current={badge.criteria.legalitas}
          target={criteriaConfig.platinum_legalitas_min}
          label="Legalitas"
        />
        <ProgressBar
          current={badge.criteria.sosmed}
          target={criteriaConfig.platinum_sosmed_min}
          label="Sosmed Aktif"
        />
      </div>
    </div>
  );
}
