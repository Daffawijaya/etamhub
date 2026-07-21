const logs = [
  {
    title: "Tambah UMKM",
    time: "2 menit lalu",
  },
  {
    title: "Edit UMKM",
    time: "20 menit lalu",
  },
  {
    title: "Import Excel",
    time: "1 jam lalu",
  },
  {
    title: "Login Admin",
    time: "3 jam lalu",
  },
];

export default function ActivityLogs() {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">Aktivitas Terbaru</h3>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.title} className="flex gap-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />

            <div>
              <p className="font-medium">{log.title}</p>

              <p className="text-sm text-slate-500">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
