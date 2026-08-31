"use client";

import { useState } from "react";

import AccountTable from "@/components/admin/akun/AccountTable";
import CreateAccountForm from "@/components/admin/akun/CreateAccountForm";

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

        <button
          onClick={() => setShowForm(true)}
          className="
            rounded-xl
            bg-violet-500
            px-4 py-2.5 sm:px-5 sm:py-3
            text-sm sm:text-base font-semibold
            text-white
            transition
            hover:opacity-90
          "
        >
          + Tambah Akun
        </button>
      </div>

      <AccountTable />

      {showForm && <CreateAccountForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
