"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleCreatePassword() {
    if (!password) {
      alert("Password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    const email = sessionStorage.getItem("register_email");

    if (!email) {
      alert("Session registrasi tidak ditemukan.");
      router.push("/auth/register");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/create-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      sessionStorage.removeItem("register_email");

      sessionStorage.removeItem("register_nik");

      alert("Registrasi berhasil.");

      router.push("/auth/login");
    } catch {
      alert("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-8 dark:bg-dark">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h1 className="text-[30px] font-semibold tracking-tight text-[#111827] dark:text-white">
            Buat Password
          </h1>

          <p className="mt-2 text-sm text-[#6B7280] dark:text-neutral-400">
            Buat password untuk menyelesaikan registrasi.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="
                  h-11 w-full rounded-md
                  border border-[#D1D5DB]
                  bg-white
                  px-4 pr-11
                  text-sm text-[#111827]
                  outline-none
                  transition
                  placeholder:text-[#9CA3AF]
                  focus:border-[#111827]
                  dark:border-neutral-700
                  dark:bg-neutral-900
                  dark:text-white
                  dark:placeholder:text-neutral-500
                  dark:focus:border-white
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-[#6B7280]
                  dark:text-neutral-400
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              Konfirmasi Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                className="
                  h-11 w-full rounded-md
                  border border-[#D1D5DB]
                  bg-white
                  px-4 pr-11
                  text-sm text-[#111827]
                  outline-none
                  transition
                  placeholder:text-[#9CA3AF]
                  focus:border-[#111827]
                  dark:border-neutral-700
                  dark:bg-neutral-900
                  dark:text-white
                  dark:placeholder:text-neutral-500
                  dark:focus:border-white
                "
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-[#6B7280]
                  dark:text-neutral-400
                "
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleCreatePassword}
            disabled={loading}
            className="
              h-11 w-full rounded-md
              bg-[#111827]
              text-sm font-medium
              text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-70
              dark:bg-white
              dark:text-black
            "
          >
            {loading ? "Menyimpan..." : "Selesaikan Registrasi"}
          </button>
        </div>
      </div>
    </section>
  );
}
