import EditUmkmForm from "@/components/admin/umkm/EditUmkmForm";
import { getBaseUrl } from "@/lib/api";
interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUmkmPage({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`${getBaseUrl()}/api/umkm/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-6">Data UMKM tidak ditemukan</div>;
  }

  const umkm = await res.json();

  return (
    <div className="px-6 pb-6 bg-light dark:bg-dark">
      <EditUmkmForm data={umkm} />
    </div>
  );
}
