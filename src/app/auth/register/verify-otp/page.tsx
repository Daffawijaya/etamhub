"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (otp.length !== 6) {
      alert("OTP harus 6 digit.");
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
      const res = await fetch("/api/auth/register/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token: otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      router.push("/auth/register/create-password");
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
            Verifikasi OTP
          </h1>

          <p className="mt-2 text-sm text-[#6B7280] dark:text-neutral-400">
            Masukkan kode OTP yang dikirim ke email Anda.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#374151] dark:text-neutral-300">
              Kode OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Masukkan 6 digit OTP"
              inputMode="numeric"
              maxLength={6}
              className="
                h-11 w-full rounded-md
                border border-[#D1D5DB]
                bg-white
                px-4
                text-center
                text-lg
                tracking-[8px]
                text-[#111827]
                outline-none
                transition
                placeholder:text-[#9CA3AF]
                placeholder:tracking-normal
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
            onClick={handleVerify}
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
            {loading ? "Memverifikasi..." : "Verifikasi OTP"}
          </button>
        </div>
      </div>
    </section>
  );
}
