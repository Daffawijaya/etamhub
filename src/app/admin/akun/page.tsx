import { redirect } from "next/navigation";

import { getRole } from "@/lib/auth";
import AkunClient from "./AkunClient";

export default async function AkunPage() {
  const role = await getRole();

  if (role !== "super_admin") {
    redirect("/admin");
  }

  return <AkunClient />;
}
