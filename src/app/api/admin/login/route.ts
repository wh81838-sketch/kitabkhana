import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "ای میل اور پاس ورڈ درست درج کریں" },
        { status: 400 }
      );
    }

    const result = await loginAdmin(parsed.data.email, parsed.data.password);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ success: true, user: result.user });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "لاگ ان میں مسئلہ پیش آیا۔ دوبارہ کوشش کریں۔" },
      { status: 500 }
    );
  }
}
