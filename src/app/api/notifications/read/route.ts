import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/notifications.json");

export async function PATCH() {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const notifications = JSON.parse(file);

    notifications.forEach((item: any) => {
      item.read = true;
    });

    await fs.writeFile(
      filePath,
      JSON.stringify(notifications, null, 2),
      "utf-8",
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
