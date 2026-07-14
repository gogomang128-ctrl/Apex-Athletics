import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { analytics } from "@/db/schema";
import { v4 as uuid } from "uuid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !message) {
      return NextResponse.json({ error: "الاسم والرسالة مطلوبان" }, { status: 400 });
    }

    await db.insert(analytics).values({
      id: uuid(),
      event: "support_ticket",
      data: JSON.stringify({
        name,
        phone,
        email,
        message,
        createdAt: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ success: true, message: "تم إرسال طلبك بنجاح" });
  } catch (error) {
    console.error("Support ticket error:", error);
    return NextResponse.json({ error: "فشل في إرسال الطلب" }, { status: 500 });
  }
}
