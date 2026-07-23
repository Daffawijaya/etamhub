import UmkmDataTable from "@/components/admin/umkm/UmkmDataTable";

async function getUmkms() {
  const res = await fetch("http://localhost:3000/api/umkm", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data UMKM");
  }

  return res.json();
}

export default async function UmkmPage() {
  const umkms = await getUmkms();

  return (
    <div className="space-y-6 px-6 pb-6">
      <div>
        <UmkmDataTable data={umkms} />
      </div>
    </div>
  );
}
