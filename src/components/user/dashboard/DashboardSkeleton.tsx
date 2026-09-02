"use client";

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-white/10 ${className}`}
    />
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Left column */}
      <div className="space-y-4 lg:col-span-8">
        {/* SummaryCards skeleton — gradient card */}
        <div className="relative overflow-hidden rounded-2xl px-5 py-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#ff7a59]/80 via-[#ff6b7d]/80 to-[#ff4fa3]/80 dark:from-[#1b1027] dark:via-[#21152f] dark:to-[#130f1d]">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
              <Pulse className="h-12 w-12 rounded-2xl bg-white/20" />
              <div className="text-center space-y-2 sm:text-right">
                <Pulse className="h-3 w-24 ml-auto bg-white/20" />
                <Pulse className="h-10 w-40 ml-auto bg-white/20" />
                <Pulse className="h-3 w-32 ml-auto bg-white/20" />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Pulse className="h-8 w-32 rounded-full bg-white/20" />
              <Pulse className="h-8 w-28 rounded-full bg-white/20" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white/10 p-4 space-y-2">
                  <Pulse className="h-3 w-20 bg-white/20" />
                  <Pulse className="h-5 w-16 bg-white/20" />
                  <Pulse className="h-2 w-24 bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LegalityCard + MonitoringSummaryCard skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* LegalityCard */}
          <div className="rounded-2xl bg-white p-6 dark:bg-dark-card">
            <div className="flex items-center justify-between mb-5">
              <Pulse className="h-5 w-32" />
              <Pulse className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 p-4 dark:border-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <Pulse className="h-3 w-12" />
                    <Pulse className="h-4 w-4 rounded-full" />
                  </div>
                  <Pulse className="mt-2 h-2 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* MonitoringSummaryCard */}
          <div className="rounded-2xl bg-white px-5 py-4 sm:p-6 dark:bg-dark-card">
            <div className="flex items-center gap-3 mb-4">
              <Pulse className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Pulse className="h-4 w-24" />
                <Pulse className="h-2.5 w-40" />
              </div>
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/[0.02]"
                >
                  <Pulse className="h-9 w-9 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Pulse className="h-3 w-28" />
                    <Pulse className="h-2.5 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BusinessInfoCard skeleton */}
        <div className="rounded-2xl bg-white px-5 py-4 sm:p-6 dark:bg-dark-card">
          <Pulse className="h-5 w-36 mb-5" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4 lg:col-span-4">
        {/* BadgeProgressCard skeleton */}          <div className="rounded-2xl bg-white px-5 py-4 sm:p-6 dark:bg-dark-card">
            <div className="flex items-center gap-3 mb-5">
            <Pulse className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Pulse className="h-4 w-28" />
              <Pulse className="h-2.5 w-36" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-5">
            {[1, 2, 3, 4].map((i) => (
              <Pulse key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Pulse className="h-2.5 w-20" />
                  <Pulse className="h-2.5 w-16" />
                </div>
                <Pulse className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* TimelineCard skeleton */}
        <div className="rounded-2xl bg-white px-5 py-4 sm:p-6 dark:bg-dark-card">
          <Pulse className="h-5 w-32 mb-5" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <Pulse className="h-3 w-3 rounded-full" />
                  <Pulse className="h-8 w-0.5" />
                </div>
                <div className="flex-1 space-y-1.5 pb-4">
                  <Pulse className="h-3 w-40" />
                  <Pulse className="h-2.5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
