"use client";

import { useState } from "react";

import AccountTable from "@/components/admin/akun/AccountTable";
import CreateAccountForm from "@/components/admin/akun/CreateAccountForm";

export default function AkunClient() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Kelola Akun
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Kelola akun admin kecamatan dan user UMKM.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="
            rounded-xl
            bg-violet-500
            px-5 py-3
            font-semibold
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
