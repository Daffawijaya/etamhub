"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.replace("/auth/login");
        return;
      }

      const user = session.user;

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          avatar: user.user_metadata.avatar_url,
        }),
      });

      const data = await response.json();

      if (data.register_required) {
        router.replace("/auth/register/google");
        return;
      }

      if (!response.ok) {
        router.replace("/auth/login");
        return;
      }

      if (data.role === "super_admin" || data.role === "admin_kecamatan") {
        router.replace("/admin");
        return;
      }

      if (data.role === "user_umkm") {
        router.replace("/user");
        return;
      }

      router.replace("/auth/login");
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Memproses login...</p>
    </div>
  );
}
