"use client";

function Pulse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-white/10 ${className}`}
      style={style}
    />
  );
}

export default function AdminDashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left column */}
      <div className="col-span-8 space-y-6">
        {/* Top row: StatsCards + QuickActions */}
        <div className="grid grid-cols-2 gap-6">
          {/* StatsCards — gradient */}
          <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#ff7a59]/80 via-[#ff6b7d]/80 to-[#ff4fa3]/80 dark:from-[#1b1027] dark:via-[#21152f] dark:to-[#130f1d]">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <Pulse className="h-12 w-12 rounded-2xl bg-white/20" />
                <div className="text-right space-y-2">
                  <Pulse className="h-3 w-24 ml-auto bg-white/20" />
                  <Pulse className="h-12 w-32 ml-auto bg-white/20" />
                  <Pulse className="h-3 w-28 ml-auto bg-white/20" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white/10 p-4 space-y-2"
                  >
                    <Pulse className="h-3 w-20 bg-white/20" />
                    <Pulse className="h-6 w-12 bg-white/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QuickActions */}
          <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
            <Pulse className="h-5 w-28 mb-5" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl p-5 space-y-3">
                  <Pulse className="h-6 w-6 mx-auto rounded-lg" />
                  <Pulse className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OmzetTrendChart skeleton */}
        <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
          <Pulse className="h-5 w-36 mb-5" />
          <div className="flex items-end gap-2 h-48">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
              <Pulse
                key={i}
                className="flex-1 rounded-t-lg"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* LatestUmkm skeleton */}
        <div className="rounded-2xl bg-white dark:bg-dark-card">
          <div className="p-6">
            <Pulse className="h-5 w-28 mb-1" />
            <Pulse className="h-3 w-48" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <Pulse className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Pulse className="h-3.5 w-32" />
                  <Pulse className="h-2.5 w-24" />
                </div>
                <Pulse className="h-3 w-20" />
                <Pulse className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Map skeleton */}
        <div className="rounded-2xl bg-white dark:bg-dark-card">
          <div className="p-6">
            <Pulse className="h-5 w-40" />
          </div>
          <div className="h-[328px] bg-slate-100 dark:bg-white/5" />
        </div>
      </div>

      {/* Right column */}
      <div className="col-span-4 space-y-6">
        {/* BadgePieChart skeleton */}
        <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
          <Pulse className="h-5 w-36 mb-1" />
          <Pulse className="h-3 w-44 mb-5" />
          <div className="flex justify-center mb-5">
            <Pulse className="h-40 w-40 rounded-full" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Pulse className="h-3 w-3 rounded-full shrink-0" />
                <Pulse className="h-3 w-24" />
                <Pulse className="h-3 w-8 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* UmkmProgressStats skeleton */}
        <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
          <Pulse className="h-5 w-40 mb-5" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Pulse className="h-3 w-28" />
                  <Pulse className="h-3 w-12" />
                </div>
                <Pulse className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* CategoryPieChart skeleton */}
        <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
          <Pulse className="h-5 w-28 mb-5" />
          <div className="flex justify-center mb-5">
            <Pulse className="h-36 w-36 rounded-full" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Pulse className="h-3 w-3 rounded-full shrink-0" />
                <Pulse className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* ActivityLogs skeleton */}
        <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
          <Pulse className="h-5 w-28 mb-5" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Pulse className="h-9 w-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Pulse className="h-3 w-36" />
                  <Pulse className="h-2.5 w-48" />
                </div>
                <Pulse className="h-2.5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
