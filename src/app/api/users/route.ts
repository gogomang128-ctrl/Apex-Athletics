import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, walletTransactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Get all users (for admin)
export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json([]);
  }
}

// Register new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("Registration attempt:", { name: body.name, email: body.email });
    
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    
    if (existing.length > 0) {
      console.log("Email already exists:", body.email);
      return NextResponse.json({ error: "البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
    }

    const userId = uuid();
    const newUser = {
      id: userId,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      password: body.password,
      walletBalance: 0,
      isAdmin: false,
    };

    console.log("Creating user:", { id: userId, name: newUser.name, email: newUser.email });

    await db.insert(users).values(newUser);

    console.log("User created successfully:", userId);

    return NextResponse.json({ 
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        walletBalance: 0,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("User create error:", error);
    return NextResponse.json({ error: "فشل في إنشاء الحساب. حاول مرة أخرى." }, { status: 500 });
  }
}

// Update user wallet (admin only)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, type, description, adminNote } = body;

    if (!userId || amount === undefined) {
      return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
    }

    // Get current user
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userList.length === 0) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const user = userList[0];
    const currentBalance = user.walletBalance || 0;
    let newBalance = currentBalance;

    if (type === "deposit") {
      newBalance = currentBalance + Number(amount);
    } else if (type === "withdraw" || type === "purchase") {
      if (currentBalance < Number(amount)) {
        return NextResponse.json({ error: "رصيد غير كافي" }, { status: 400 });
      }
      newBalance = currentBalance - Number(amount);
    }

    // Update user balance
    await db.update(users).set({ walletBalance: newBalance }).where(eq(users.id, userId));

    // Record transaction
    await db.insert(walletTransactions).values({
      id: uuid(),
      userId,
      amount: Number(amount),
      type,
      description: description || "",
      adminNote: adminNote || "",
    });

    return NextResponse.json({ success: true, message: "تم التحديث", newBalance });
  } catch (error) {
    console.error("Wallet update error:", error);
    return NextResponse.json({ error: "فشل في التحديث" }, { status: 500 });
  }
}
