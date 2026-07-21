export default function DashboardHeader() {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Halo Daffa 👋</h1>

      <p className="text-neutral-500">Selamat Datang di Dashboard EtamHub</p>

      <div className="text-sm text-neutral-500">{today} • Admin Lokal</div>
    </div>
  );
}
