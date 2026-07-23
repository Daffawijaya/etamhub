"use client";

import { useRouter } from "next/navigation";
import BigChevronButtonButton from "./BigChevronButton";

export default function ExploreButton() {
  const router = useRouter();

  return (
    <BigChevronButtonButton
      title="Jelajahi Kecamatan"
      onClick={() => router.push("/#kecamatan")}
    />
  );
}