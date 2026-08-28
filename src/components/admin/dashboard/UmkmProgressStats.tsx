import { Globe, ShieldCheck } from "lucide-react";

interface Props {
  digitalCount: number;
  digitalPercent: number;
  legalitasCount: number;
  legalitasPercent: number;
  totalUmkm: number;
}

export default function UmkmProgressStats({
  digitalCount,
  digitalPercent,
  legalitasCount,
  legalitasPercent,
  totalUmkm,
}: Props) {
  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card p-6 transition-colors duration-300">
      <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">
        Progress UMKM
      </h2>

      <div className="space-y-5">
        {/* Digitalisasi */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <Globe size={16} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Digitalisasi
              </span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {digitalCount}/{totalUmkm} UMKM
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out"
              style={{ width: `${digitalPercent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            Memiliki Instagram, Facebook, atau TikTok
          </p>
        </div>

        {/* Legalitas */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <ShieldCheck size={16} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Legalitas
              </span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {legalitasCount}/{totalUmkm} UMKM
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${legalitasPercent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            Memiliki Halal, PIRT, atau HAKI
          </p>
        </div>
      </div>
    </div>
  );
}
