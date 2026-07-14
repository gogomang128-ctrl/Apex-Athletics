import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log("Login attempt:", email);

    if (!email || !password) {
      return NextResponse.json({ error: "البريد وكلمة المرور مطلوبان" }, { status: 400 });
    }

    // Find user by email (case insensitive)
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    console.log("Found users:", userList.length);

    if (userList.length === 0) {
      return NextResponse.json({ error: "البريد الإلكتروني غير مسجل" }, { status: 401 });
    }

    const user = userList[0];

    // Check password
    if (user.password !== password) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const token = Buffer.from(`user:${user.id}:${Date.now()}`).toString("base64");

    console.log("Login successful:", user.id);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance || 0,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "حدث خطأ في تسجيل الدخول" }, { status: 500 });
  }
}
