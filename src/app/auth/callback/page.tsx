"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SUPER_ADMIN_ROLE_ID = "258979bc-1ec6-4549-9fa0-1ba7b577383e";

const ADMIN_KECAMATAN_ROLE_ID = "ff4193d3-af5f-4f52-afc3-73e6a11d3f3c";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.replace("/login");
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
        router.replace("/register/google");
        return;
      }

      if (!response.ok) {
        router.replace("/login");
        return;
      }

      if (
        data.role_id === SUPER_ADMIN_ROLE_ID ||
        data.role_id === ADMIN_KECAMATAN_ROLE_ID
      ) {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Memproses login...</p>
    </div>
  );
}
