import UmkmForm from "@/components/form/UmkmForm";

export default function UserTambahUmkmPage() {
  return (
    <main className="min-h-screen px-6 pb-6 bg-light dark:bg-dark">
      <UmkmForm mode="create" role="user" />
    </main>
  );
}
