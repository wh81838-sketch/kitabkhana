import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/** List all books (admin) with optional status filter */
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status"); // draft | published | archived | all
  const where =
    status && status !== "all" ? { status } : {};

  const books = await prisma.book.findMany({
    where,
    include: {
      author: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ books });
}

const updateSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["publish", "unpublish", "archive", "feature", "unfeature", "delete"]),
});

/** Bulk actions: publish, unpublish, archive, feature, delete */
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { ids, action } = parsed.data;

    if (action === "delete") {
      await prisma.book.deleteMany({ where: { id: { in: ids } } });
      return NextResponse.json({ success: true, action, count: ids.length });
    }

    const data: Record<string, unknown> = {};
    if (action === "publish") data.status = "published";
    if (action === "unpublish") data.status = "draft";
    if (action === "archive") data.status = "archived";
    if (action === "feature") data.featured = true;
    if (action === "unfeature") data.featured = false;

    const result = await prisma.book.updateMany({
      where: { id: { in: ids } },
      data,
    });

    return NextResponse.json({ success: true, action, count: result.count });
  } catch (e) {
    console.error("Books PATCH error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
