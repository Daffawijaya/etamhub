import umkms from "@/data/umkm.json";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Kategori UMKM</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {data.map(([name, value]) => {
          const percentage = (value / total) * 100;

          return (
            <div key={name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{name}</span>

                <span className="text-sm text-muted-foreground">
                  {value} UMKM
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: COLORS[name as keyof typeof COLORS],
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
