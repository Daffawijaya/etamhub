interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

export default function KecamatanChart({ data }: Props) {
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 9);

  const maxValue = sortedData[0]?.value ?? 1;

  const totalUmkm = data.reduce((acc, item) => acc + item.value, 0);

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
        "
      >
        Top Kecamatan
      </h2>

      <div className="space-y-5">
        {sortedData.map((item) => {
          const percentage = totalUmkm
            ? ((item.value / totalUmkm) * 100).toFixed(1)
            : "0";

          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span
                  className="
                    font-medium 
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {item.name}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className="
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {item.value} UMKM
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
                    width: `${(item.value / maxValue) * 100}%`,
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
