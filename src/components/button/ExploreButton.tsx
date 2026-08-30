"use client";

import { useRouter } from "next/navigation";
import BigChevronButtonButton from "./BigChevronButton";

export default function ExploreButton() {
  const router = useRouter();

  return (
    <BigChevronButtonButton
      title="Jelajahi Kecamatan"
      onClick={() => {
        document.getElementById("kecamatan")?.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "#kecamatan");
      }}
    />
  );
}