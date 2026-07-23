import umkms from "@/data/umkm.json";

export default function KecamatanChart() {
  const data = Object.entries(
    umkms.reduce(
      (acc, item) => {
        acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9);

  const maxValue = data[0]?.[1] ?? 1;
  const totalUmkm = umkms.length;

  return (
    <div
      className="
        rounded-2xl 
        bg-white 
        dark:bg-dark-card
        p-6
        transition-colors
        duration-300
      "
    >
      <h2
        className="
          mb-5 
          text-lg 
          font-semibold
          text-slate-900
          dark:text-white
          transition-colors
          duration-300
        "
      >
        Top Kecamatan
      </h2>

      <div className="space-y-5">
        {data.map(([kecamatan, total]) => {
          const percentage = ((total / totalUmkm) * 100).toFixed(1);

          return (
            <div key={kecamatan}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span
                  className="
                    font-medium 
                    text-slate-700
                    dark:text-slate-200
                    transition-colors
                    duration-300
                  "
                >
                  {kecamatan}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className="
                      text-slate-500
                      dark:text-slate-400
                      transition-colors
                      duration-300
                    "
                  >
                    {total} UMKM
                  </span>

                  <span
                    className="
                      rounded-full 
                      bg-slate-100 
                      px-2 
                      py-0.5 
                      text-xs 
                      font-medium 
                      text-slate-600
                      dark:bg-dark
                      dark:text-slate-300
                      transition-colors
                      duration-300
                    "
                  >
                    {percentage}%
                  </span>
                </div>
              </div>

              <div
                className="
                  h-3 
                  overflow-hidden 
                  rounded-full 
                  bg-slate-100
                  dark:bg-dark
                  transition-colors
                  duration-300
                "
              >
                <div
                  className="
                    h-full 
                    rounded-full 
                    transition-all 
                    duration-500
                  "
                  style={{
                    width: `${(total / maxValue) * 100}%`,
                    background:
                      "linear-gradient(90deg, #1184CA 0%, #844EC0 50%, #CA3785 100%)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
