import type { ReactNode } from "react";
import {
  DiamondIcon,
  GoldMedalIcon,
  SeedlingIcon,
  SilverMedalIcon,
} from "@/components/icons/BadgeIcons";
import type { BadgeResult } from "@/lib/monitoring/badges";

const BADGE_ICONS: Record<string, ReactNode> = {
  bronze: <SeedlingIcon className="h-3 w-3" />,
  silver: <SilverMedalIcon className="h-3 w-3" />,
  gold: <GoldMedalIcon className="h-3 w-3" />,
  platinum: <DiamondIcon className="h-3 w-3" />,
};

const BADGE_RING: Record<string, string> = {
  bronze: "border-emerald-300/80 dark:border-emerald-500/60",
  silver: "border-slate-300/80 dark:border-slate-500/60",
  gold: "border-amber-300/80 dark:border-amber-500/60",
  platinum: "border-purple-300/80 dark:border-purple-500/60",
};

type Props = {
  badge: BadgeResult | null | undefined;
  className?: string;
};

// Pill badge UMKM — desain disamakan halaman publik lain.
// Tanpa badge (level "none") tidak render apa-apa.
export default function UmkmBadge({ badge, className = "" }: Props) {
  if (!badge || badge.level === "none") return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border bg-white/90 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm dark:bg-black/70 ${BADGE_RING[badge.level] ?? ""} ${badge.color} ${className}`}
    >
      {BADGE_ICONS[badge.level]}
      <span className="hidden sm:inline">{badge.label}</span>
    </span>
  );
}
