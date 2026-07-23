import EditUmkmForm from "@/components/admin/umkm/EditUmkmForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUmkmPage({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/umkm/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-6">Data UMKM tidak ditemukan</div>;
  }

  const umkm = await res.json();

  return (
    <div>
      <EditUmkmForm data={umkm} />
    </div>
  );
}
