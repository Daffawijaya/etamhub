import umkms from "@/data/umkm.json";

function getRelativeTime(dateString?: string) {
  if (!dateString) return "Belum ada waktu";

  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 1) return "Baru saja";

  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} jam lalu`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} hari lalu`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} bulan lalu`;
  }

  const years = Math.floor(months / 12);

  return `${years} tahun lalu`;
}

export default function ActivityLogs() {
  const activities = [...umkms]
    .map((item) => ({
      ...item,
      activityDate:
        item.updatedAt ||
        item.createdAt ||
        new Date().toISOString(),
    }))
    .sort(
      (a, b) =>
        new Date(b.activityDate).getTime() -
        new Date(a.activityDate).getTime(),
    )
    .slice(0, 5)
    .map((item) => ({
      title:
        item.createdAt &&
        item.updatedAt &&
        item.createdAt !== item.updatedAt
          ? `Update UMKM ${item.nama}`
          : `Tambah UMKM ${item.nama}`,

      time: getRelativeTime(item.activityDate),
    }));

  return (
    <div className="rounded-2xl bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        Aktivitas Terbaru
      </h2>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada aktivitas
        </p>
      ) : (
        <div className="space-y-5">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" />

              <div>
                <p className="font-medium text-gray-900">
                  {activity.title}
                </p>

                <p className="text-sm text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}