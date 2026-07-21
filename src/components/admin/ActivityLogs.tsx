import umkms from "@/data/umkm.json";

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);

  if (days < 30) return `${days} hari lalu`;

  const months = Math.floor(days / 30);

  if (months < 12) return `${months} bulan lalu`;

  const years = Math.floor(months / 12);

  return `${years} tahun lalu`;
}

export default function ActivityLogs() {
  const activities = [...umkms]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5)
    .map((item) => ({
      title:
        item.createdAt === item.updatedAt
          ? `Tambah UMKM ${item.nama}`
          : `Update UMKM ${item.nama}`,
      time: getRelativeTime(item.updatedAt),
    }));

  return (
    <div className="rounded-[32px] bg-white p-6">
      <h3 className="mb-6 text-lg font-semibold">Aktivitas Terbaru</h3>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            <div className="mt-2 h-2.5 w-2.5 rounded-full bg-green-500" />

            <div>
              <p className="font-medium text-slate-900">{activity.title}</p>

              <p className="text-sm text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
