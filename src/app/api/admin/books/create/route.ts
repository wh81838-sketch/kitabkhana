import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createHash } from "crypto";

const schema = z.object({
  title: z.string().min(1).max(300),
  authorName: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  readingUrl: z.string().optional(),
  sourceUrl: z.string().optional(),
  categoryId: z.string().optional(),
  genre: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

function slugify(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || `book-${Date.now()}`
  );
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "غلط ڈیٹا" }, { status: 400 });
    }

    const d = parsed.data;
    let authorId: string | undefined;

    if (d.authorName) {
      const authorSlug = slugify(d.authorName);
      const author = await prisma.author.upsert({
        where: { slug: authorSlug },
        update: {},
        create: { name: d.authorName, slug: authorSlug },
      });
      authorId = author.id;
    }

    const base = slugify(d.title);
    const slug =
      base +
      "-" +
      createHash("md5").update(d.title + Date.now()).digest("hex").slice(0, 6);

    const book = await prisma.book.create({
      data: {
        title: d.title,
        slug,
        description: d.description || null,
        coverUrl: d.coverUrl || null,
        readingUrl: d.readingUrl || null,
        sourceUrl: d.sourceUrl || null,
        genre: d.genre || null,
        categoryId: d.categoryId || null,
        authorId: authorId || null,
        status: d.status,
        featured: d.featured,
        contentType: d.readingUrl ? "external" : "metadata",
        copyrightStatus: d.readingUrl ? "external" : "unknown",
      },
    });

    return NextResponse.json({ success: true, book });
  } catch (e) {
    console.error("Create book error:", e);
    return NextResponse.json({ error: "محفوظ نہیں ہو سکی" }, { status: 500 });
  }
}
