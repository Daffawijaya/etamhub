"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

const WARNING_BEFORE_MS = 60 * 60 * 1000; // 1 hour before expiry
const CHECK_INTERVAL_MS = 60 * 1000; // check every 1 minute

export function useSessionExpiry() {
  const warnedRef = useRef(false);

  useEffect(() => {
    // Read cookies (httpOnly cookies can't be read from JS, so we use session_max_age from non-httpOnly)
    // Actually session_max_age is httpOnly too, so we calculate from page load time
    // We'll use an alternative: read a non-httpOnly timestamp cookie or just track from mount

    // Since cookies are httpOnly, we track session start from when this hook mounts
    // and use the session_max_age value we pass via data attribute or meta tag.
    // Simpler approach: fetch /api/auth/me which returns session info, or just read from cookies.

    // Best approach: we stored session_created_at and session_max_age as httpOnly cookies,
    // so we can't read them from client JS. Instead, let's create a lightweight endpoint
    // or use a different strategy.

    // Alternative: just track from page load. When the hook mounts, we know the session
    // is active. We can calculate remaining time by checking /api/auth/session-expiry.

    // Simplest approach without extra endpoint: store session info in a non-httpOnly cookie
    // or localStorage on login. But since we want httpOnly for security...

    // Let's just use a meta tag approach or a lightweight fetch.
    // Actually, the simplest and most reliable: create a small API endpoint that returns
    // the session expiry info, and poll it.

    // For now, let's use the approach of fetching a session info endpoint.
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let unmounted = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session-info", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        const { createdAt, maxAge } = data;

        if (!createdAt || !maxAge) return;

        const elapsed = Date.now() - createdAt;
        const remaining = maxAge * 1000 - elapsed;
        const timeUntilWarning = remaining - WARNING_BEFORE_MS;

        if (remaining <= 0) {
          // Session already expired
          if (!warnedRef.current) {
            warnedRef.current = true;
            toast.error("Sesi telah berakhir", {
              description: "Silakan login kembali.",
              duration: Infinity,
              action: {
                label: "Login",
                onClick: () => {
                  window.location.href = "/auth/login";
                },
              },
            });
          }
          return;
        }

        if (remaining <= WARNING_BEFORE_MS) {
          // Within warning window, show warning
          if (!warnedRef.current) {
            warnedRef.current = true;
            const minutesLeft = Math.ceil(remaining / 60000);
            toast.warning("Sesi hampir berakhir", {
              description: `Sesi Anda akan berakhir dalam ${minutesLeft} menit. Silakan perpanjang atau simpan pekerjaan Anda.`,
              duration: 15000,
              action: {
                label: "Perpanjang",
                onClick: async () => {
                  try {
                    await fetch("/api/auth/session-refresh", { method: "POST" });
                    warnedRef.current = false;
                    toast.success("Sesi diperpanjang!");
                    // Re-check after refresh
                    timeoutId = setTimeout(checkSession, 5000);
                  } catch {
                    window.location.href = "/auth/login";
                  }
                },
              },
            });
          }
          return;
        }

        // Schedule warning
        if (timeUntilWarning > 0 && timeUntilWarning < CHECK_INTERVAL_MS * 2) {
          timeoutId = setTimeout(() => {
            warnedRef.current = false;
            checkSession();
          }, timeUntilWarning);
        }
      } catch {
        // Silently fail, will retry on next interval
      }
    }

    // Initial check
    checkSession();

    // Periodic check
    intervalId = setInterval(() => {
      warnedRef.current = false;
      checkSession();
    }, CHECK_INTERVAL_MS);

    return () => {
      unmounted = true;
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);
}
