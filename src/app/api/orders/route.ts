import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { v4 as uuid } from "uuid";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json(allOrders);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOrder = {
      id: uuid(),
      customerName: body.customerName || "",
      customerEmail: body.customerEmail || "",
      customerPhone: body.customerPhone || "",
      items: typeof body.items === "string" ? body.items : JSON.stringify(body.items || []),
      totalAmount: Number(body.totalAmount) || 0,
      status: "pending",
    };
    await db.insert(orders).values(newOrder);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (body.status) {
      await db.update(orders).set({ status: body.status }).where(eq(orders.id, body.id));
    }
    return NextResponse.json({ message: "Updated" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
