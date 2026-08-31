"use client";

import { useSessionExpiry } from "@/hooks/useSessionExpiry";

export default function SessionExpiryChecker() {
  useSessionExpiry();
  return null;
}
