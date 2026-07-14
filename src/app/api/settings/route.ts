import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    const all = await db.select().from(siteSettings);
    const settings: Record<string, string> = {};
    all.forEach(s => { settings[s.key] = s.value; });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(siteSettings).set({ value: String(value), updatedAt: new Date() }).where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({ id: uuid(), key, value: String(value) });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
