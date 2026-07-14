import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, walletTransactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const userList = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (userList.length === 0) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const transactions = await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, id))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(50);

    return NextResponse.json({
      user: { ...userList[0], password: undefined },
      transactions,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
