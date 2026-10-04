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

/** Safe ASCII slug — Urdu-only titles used to break /book/[slug] URLs */
function makeBookSlug(title: string): string {
  const hash = createHash("md5")
    .update(title + "-" + Date.now() + "-" + Math.random())
    .digest("hex")
    .slice(0, 10);
  const ascii = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return ascii ? `${ascii}-${hash}` : `book-${hash}`;
}

function makeAuthorSlug(name: string): string {
  const hash = createHash("md5").update(name).digest("hex").slice(0, 6);
  const ascii = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return ascii ? `${ascii}-${hash}` : `author-${hash}`;
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

    if (d.authorName?.trim()) {
      const authorSlug = makeAuthorSlug(d.authorName.trim());
      // Prefer match by name if slug collision
      const existing = await prisma.author.findFirst({
        where: { name: d.authorName.trim() },
      });
      if (existing) {
        authorId = existing.id;
      } else {
        const author = await prisma.author.create({
          data: { name: d.authorName.trim(), slug: authorSlug },
        });
        authorId = author.id;
      }
    }

    let slug = makeBookSlug(d.title);
    // Ensure unique
    const clash = await prisma.book.findUnique({ where: { slug } });
    if (clash) {
      slug = `book-${createHash("md5").update(slug + Date.now()).digest("hex").slice(0, 12)}`;
    }

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
