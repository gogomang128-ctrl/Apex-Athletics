import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, analytics } from "@/db/schema";
import { desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allProducts = await db.select().from(products);
    const allEvents = await db.select().from(analytics).orderBy(desc(analytics.createdAt)).limit(100);

    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = allOrders.length;
    const totalProducts = allProducts.length;
    const pendingOrders = allOrders.filter(o => o.status === "pending").length;
    const completedOrders = allOrders.filter(o => o.status === "completed").length;

    const monthlyData: Record<string, number> = {};
    allOrders.forEach(order => {
      if (order.createdAt) {
        const month = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        monthlyData[month] = (monthlyData[month] || 0) + (order.totalAmount || 0);
      }
    });

    const categoryData: Record<string, number> = {};
    allProducts.forEach(p => {
      categoryData[p.category] = (categoryData[p.category] || 0) + 1;
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      pendingOrders,
      completedOrders,
      monthlyRevenue: Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue })),
      categoryDistribution: Object.entries(categoryData).map(([category, count]) => ({ category, count })),
      recentOrders: allOrders.slice(0, 10),
      recentEvents: allEvents.slice(0, 20),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      pendingOrders: 0,
      completedOrders: 0,
      monthlyRevenue: [],
      categoryDistribution: [],
      recentOrders: [],
      recentEvents: [],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await db.insert(analytics).values({
      id: uuid(),
      event: body.event || "page_view",
      data: JSON.stringify(body.data || {}),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
