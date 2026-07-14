import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = "01147497465";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    
    if (password === ADMIN_PASSWORD) {
      const token = Buffer.from(`admin:${Date.now()}:apex-athletics-secret`).toString("base64");
      return NextResponse.json({ success: true, token });
    }
    
    return NextResponse.json({ success: false, error: "كلمة المرور غير صحيحة" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
