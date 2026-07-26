import UmkmDataTable from "@/components/admin/umkm/UmkmDataTable";

export default async function UmkmPage() {
  return (
    <div className="space-y-6 px-6 pb-6 bg-light dark:bg-dark h-min-screen">
      <div className="bg-light dark:bg-dark h-min-screen">
        <UmkmDataTable limit={10} />
      </div>
    </div>
  );
}
