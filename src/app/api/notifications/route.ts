import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/notifications.json");

export async function GET() {
  try {
    const file = await fs.readFile(filePath, "utf-8");

    const notifications = JSON.parse(file);

    notifications.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);

    return NextResponse.json([], {
      status: 200,
    });
  }
}
