"use client";

import { useEffect, useState } from "react";

interface AuthState {
  isLoggedIn: boolean;
  role: string | null;
  dashboardPath: string;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
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
    const userId = getCookie("user_id");
    const role = getCookie("role");

    if (userId) {
      setAuth({
        isLoggedIn: true,
        role: role ?? "user",
        dashboardPath: getDashboardPath(role),
      });
    }
  }, []);

  return auth;
}
