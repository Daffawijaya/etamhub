"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function GoogleRegisterPage() {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNikChange = (value: string) => {
    setNik(value.replace(/\D/g, "").slice(0, 16));
  };

  async function handleRegister() {
    if (nik.length !== 16) {
      alert("NIK harus terdiri dari 16 digit.");
      return;
    }

    if (!password) {
      alert("Password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (!confirmPassword) {
      alert("Konfirmasi password wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak sama.");
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
            onChange={(e) => handleNikChange(e.target.value)}
            placeholder="Masukkan NIK"
            inputMode="numeric"
            maxLength={16}
            pattern="[0-9]{16}"
            className="
              w-full rounded-xl border border-neutral-300
              bg-white px-4 py-3 text-black outline-none
              transition focus:border-primary
              dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 pr-12 text-black outline-none transition focus:border-primary dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Konfirmasi Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 pr-12 text-black outline-none transition focus:border-primary dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full rounded-full bg-violet-500 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Menyimpan..." : "Buat Akun"}
        </button>
      </div>
    </section>
  );
}
