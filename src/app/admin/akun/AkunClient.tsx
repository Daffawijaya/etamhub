"use client";

import { useState } from "react";

import AccountTable from "@/components/admin/akun/AccountTable";
import CreateAccountForm from "@/components/admin/akun/CreateAccountForm";
import BrandButton from "@/components/ui/BrandButton";
import { Plus } from "lucide-react";

export default function AkunClient() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            Kelola Akun
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Kelola akun admin kecamatan dan user UMKM.
          </p>
        </div>

        <BrandButton
          variant="primary"
          size="md"
          onClick={() => setShowForm(true)}
          icon={<Plus size={16} />}
        >
          Tambah Akun
        </BrandButton>
      </div>

      <AccountTable />

      {showForm && <CreateAccountForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
