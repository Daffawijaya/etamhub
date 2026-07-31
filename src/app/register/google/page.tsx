"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleRegisterPage() {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nik || !password) {
      alert("NIK dan password wajib diisi");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/google/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nik,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Lengkapi Akun</h1>

          <p className="mt-2 text-sm text-neutral-500">
            Masukkan NIK dan password untuk menyelesaikan pendaftaran.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">NIK</label>

          <input
            type="text"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder="Masukkan NIK"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full rounded-full bg-violet-500 py-4 font-semibold text-white"
        >
          {loading ? "Menyimpan..." : "Buat Akun"}
        </button>
      </div>
    </section>
  );
}
