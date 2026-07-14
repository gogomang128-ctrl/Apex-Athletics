import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProduct = {
      id: uuid(),
      name: body.name || "",
      nameAr: body.nameAr || "",
      description: body.description || "",
      descriptionAr: body.descriptionAr || "",
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      discount: body.discount ? Number(body.discount) : 0,
      category: body.category || "general",
      imageUrl: body.imageUrl || "/images/logo.png",
      features: typeof body.features === "string" ? body.features : JSON.stringify(body.features || []),
      badge: body.badge || null,
      inStock: body.inStock !== false,
      rating: Number(body.rating) || 5,
      reviewCount: Number(body.reviewCount) || 0,
    };
    await db.insert(products).values(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = Number(body.originalPrice);
    if (body.discount !== undefined) updateData.discount = Number(body.discount);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.features !== undefined) updateData.features = typeof body.features === "string" ? body.features : JSON.stringify(body.features);
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.rating !== undefined) updateData.rating = Number(body.rating);
    if (body.reviewCount !== undefined) updateData.reviewCount = Number(body.reviewCount);
    updateData.updatedAt = new Date();

    await db.update(products).set(updateData).where(eq(products.id, body.id));
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
