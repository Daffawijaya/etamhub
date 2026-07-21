import umkms from "@/data/umkm.json";

export default function KecamatanChart() {
  const data = Object.entries(
    umkms.reduce(
      (acc, item) => {
        acc[item.kecamatan] =
          (acc[item.kecamatan] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">
        Top Kecamatan
      </h3>

      <div className="space-y-4">
        {data.map(([kecamatan, total]) => (
          <div key={kecamatan}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{kecamatan}</span>
              <span>{total}</span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-[#1184CA]"
                style={{
                  width: `${(total / data[0][1]) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}