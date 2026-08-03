"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNikChange = (value: string) => {
    setNik(value.replace(/\D/g, "").slice(0, 16));
  };

  async function handleRegister() {
    if (nik.length !== 16) {
      alert("NIK harus terdiri dari 16 digit.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      alert("Email wajib diisi.");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(normalizedEmail)) {
      alert("Email harus menggunakan akun @gmail.com.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nik,
          email: normalizedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("REGISTER ERROR:", data);

        alert(
          typeof data?.message === "string"
            ? data.message
            : "Terjadi kesalahan.",
        );

        return;
      }

      sessionStorage.setItem("register_email", normalizedEmail);

      sessionStorage.setItem("register_nik", nik);

      router.push("/auth/register/verify-otp");
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
            Sign up
          </h1>

          <p className="mt-2 text-sm text-[#6B7280] dark:text-neutral-400">
            Buat akun baru untuk mengakses etamhub.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              NIK
            </label>

            <input
              type="text"
              value={nik}
              onChange={(e) => handleNikChange(e.target.value)}
              placeholder="Masukkan NIK"
              inputMode="numeric"
              maxLength={16}
              className="
                h-11 w-full rounded-md
                border border-[#D1D5DB]
                bg-white
                px-4
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
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@gmail.com"
              className="
                h-11 w-full rounded-md
                border border-[#D1D5DB]
                bg-white
                px-4
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
          </div>

          <button
            onClick={handleRegister}
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
            {loading ? "Mengirim OTP..." : "Kirim OTP"}
          </button>

          <p className="pt-2 text-center text-sm text-[#6B7280] dark:text-neutral-400">
            Sudah Punya Akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="
                font-medium
                text-[#111827]
                transition
                hover:underline
                dark:text-white
              "
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
