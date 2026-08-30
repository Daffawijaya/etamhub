"use client";

import { useEffect, useState } from "react";

interface AuthState {
  isLoggedIn: boolean;
  role: string | null;
  dashboardPath: string;
}

function getDashboardPath(role: string | null): string {
  switch (role) {
    case "super_admin":
    case "admin":
    case "admin_kecamatan":
      return "/admin";
    case "user_umkm":
      return "/user/umkm";
    default:
      return "/admin";
  }
}

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    dashboardPath: "/auth/login",
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.id) {
            setAuth({
              isLoggedIn: true,
              role: data.role ?? "user",
              dashboardPath: getDashboardPath(data.role),
            });
          }
        }
      } catch {
        // not logged in
      }
    }

    checkAuth();
  }, []);

  return auth;
}
