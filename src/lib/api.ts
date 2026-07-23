// src/lib/api.ts

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_URL || "";
}
