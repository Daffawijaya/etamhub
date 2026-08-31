import UmkmDataTable from "@/components/admin/umkm/UmkmDataTable";

export default async function UmkmPage() {
  return (
    <div>
      <div>
        <UmkmDataTable limit={10} />
      </div>
    </div>
  );
}
