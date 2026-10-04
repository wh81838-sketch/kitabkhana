import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { processImportUrl, type ImportResult } from "@/lib/importer";
import { z } from "zod";
import { createHash } from "crypto";

const schema = z.object({
  urls: z.array(z.string().url()).min(1).max(200),
});

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "کم از کم ایک درست URL درکار ہے (زیادہ سے زیادہ 200)" },
        { status: 400 }
      );
    }

    const urls = [...new Set(parsed.data.urls.map((u) => u.trim()))];
    const batchId = createHash("md5")
      .update(session.userId + Date.now() + urls.join(","))
      .digest("hex")
      .slice(0, 16);

    // Process sequentially to avoid overwhelming targets
    const results: ImportResult[] = [];
    for (const url of urls) {
      const result = await processImportUrl(url, batchId);
      results.push(result);
    }

    const summary = {
      total: results.length,
      imported: results.filter((r) => r.status === "imported").length,
      needs_review: results.filter((r) => r.status === "needs_review").length,
      duplicate: results.filter((r) => r.status === "duplicate").length,
      failed: results.filter((r) => r.status === "failed").length,
    };

    return NextResponse.json({ batchId, results, summary });
  } catch (e) {
    console.error("Import error:", e);
    return NextResponse.json(
      { error: "امپورٹ میں مسئلہ پیش آیا" },
      { status: 500 }
    );
  }
}
