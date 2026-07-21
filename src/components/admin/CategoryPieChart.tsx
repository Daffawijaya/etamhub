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
    <div className="rounded-[32px] bg-white p-6">
      <h3 className="mb-6 text-lg font-semibold">Kategori UMKM</h3>

      <div className="space-y-5">
        {data.map(([name, value]) => {
          const percentage = (value / total) * 100;

          return (
            <div key={name}>
              <div className="mb-2 flex justify-between">
                <span className="font-medium">{name}</span>
                <span className="text-slate-500">{value} UMKM</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: COLORS[name as keyof typeof COLORS],
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
