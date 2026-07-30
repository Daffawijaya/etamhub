"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        password,
      }),
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (data.role === "super_admin" || data.role === "admin_kecamatan") {
      window.location.href = "/admin";
    } else if (data.role === "user") {
      window.location.href = "/dashboard";
    }
  };

  return (
    <section className="relative flex items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="absolute left-8 top-5 text-3xl font-extrabold text-black dark:text-white"
      >
        etamhub.
      </Link>

      <div className="w-full max-w-md">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Login
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Masuk untuk mengakses EtamHub.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Username / NIK
            </label>

            <input
              type="text"
              placeholder="Masukkan username atau NIK"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="
                w-full rounded-xl
                border border-neutral-300
                bg-white
                px-4 py-3
                text-black
                outline-none
                transition
                focus:border-primary
                dark:border-neutral-700
                dark:bg-neutral-900
                dark:text-white
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full rounded-xl
                border border-neutral-300
                bg-white
                px-4 py-3
                text-black
                outline-none
                transition
                focus:border-violet-500
                dark:border-neutral-700
                dark:bg-neutral-900
                dark:text-white
              "
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleLogin}
              className="
                w-full rounded-full
                bg-violet-500
                py-4
                font-semibold
                text-white
                transition
                hover:opacity-90
              "
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
