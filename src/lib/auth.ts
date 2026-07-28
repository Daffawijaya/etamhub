import { cookies } from "next/headers";

export async function getRole() {
  const cookieStore = await cookies();

  return cookieStore.get("role")?.value;
}