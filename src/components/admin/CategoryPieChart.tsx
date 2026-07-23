import umkms from "@/data/umkm.json";

const COLORS = {
  Perdagangan: "#1184CA",
  Jasa: "#844EC0",
  Industri: "#F59E0B",
};

export default function CategoryStats() {
  const total = umkms.length;

  const data = Object.entries(
    umkms.reduce(
      (acc, item) => {
        acc[item.kategori] = (acc[item.kategori] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

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
          text-gray-900
          dark:text-white
          transition-colors
          duration-300
        "
      >
        Kategori UMKM
      </h2>

      <div className="space-y-5">
        {data.map(([name, value]) => {
          const percentage = (value / total) * 100;

          return (
            <div key={name}>
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="
                    font-medium
                    text-gray-900
                    dark:text-white
                    transition-colors
                    duration-300
                  "
                >
                  {name}
                </span>

                <span
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    transition-colors
                    duration-300
                  "
                >
                  {value} UMKM
                </span>
              </div>

              <div
                className="
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-gray-100
                  dark:bg-black/30
                  transition-colors
                  duration-300
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    transition-all
                    duration-300
                  "
                  style={{
                    width: `${percentage}%`,
                    backgroundColor:
                      COLORS[name as keyof typeof COLORS],
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