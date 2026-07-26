const COLORS = {
  Perdagangan: "#1184CA",
  Jasa: "#844EC0",
  Industri: "#F59E0B",
};

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

export default function CategoryStats({ data }: Props) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

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
        {data.map((item) => {
          const percentage = total ? (item.value / total) * 100 : 0;

          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="
                    font-medium
                    text-gray-900
                    dark:text-white
                  "
                >
                  {item.name}
                </span>

                <span
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {item.value} UMKM
                </span>
              </div>

              <div
                className="
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-gray-100
                  dark:bg-black/30
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
                    backgroundColor: COLORS[item.name as keyof typeof COLORS],
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
