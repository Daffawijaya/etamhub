import umkms from "@/data/umkm.json";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import UmkmTable from "./UmkmTable";

export default function LatestUmkm() {
  const latest = [...umkms]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <Card className="pb-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          UMKM Terbaru
        </CardTitle>

        <CardDescription className="text-sm text-slate-500">
          5 UMKM yang terakhir ditambahkan ke EtamHub
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <CardContent className="p-0">
          <UmkmTable data={latest} />
        </CardContent>
      </CardContent>
    </Card>
  );
}
