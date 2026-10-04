import { prisma } from "./prisma";
import { createHash } from "crypto";

/** SSRF protection — block private/internal hosts */
function isSafeUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (!["http:", "https:"].includes(u.protocol)) return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      /^169\.254\./.test(host) ||
      host === "metadata.google.internal"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function slugify(text: string): string {
  const hash = createHash("md5").update(text + Date.now()).digest("hex").slice(0, 8);
  const ascii = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return ascii ? `${ascii}-${hash}` : `book-${hash}`;
}

export type ExtractedMeta = {
  title?: string;
  author?: string;
  description?: string;
  coverUrl?: string;
  siteName?: string;
};

/** Extract permitted metadata from HTML (Open Graph / basic tags) — no full content scrape */
export function extractMetadata(html: string, sourceUrl: string): ExtractedMeta {
  const meta: ExtractedMeta = {};

  const og = (prop: string) => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i"
    );
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i"
    );
    return html.match(re)?.[1] || html.match(re2)?.[1];
  };

  meta.title =
    og("og:title") ||
    og("twitter:title") ||
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();

  meta.description =
    og("og:description") ||
    og("description") ||
    og("twitter:description");

  meta.coverUrl = og("og:image") || og("twitter:image");

  meta.siteName = og("og:site_name");

  // Try common author patterns
  const authorMeta =
    og("author") ||
    og("og:article:author") ||
    html.match(/<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i)?.[1];
  if (authorMeta) meta.author = authorMeta;

  // Resolve relative cover URLs
  if (meta.coverUrl && meta.coverUrl.startsWith("/")) {
    try {
      meta.coverUrl = new URL(meta.coverUrl, sourceUrl).href;
    } catch {
      /* keep as-is */
    }
  }

  // Decode common HTML entities
  const decode = (s?: string) =>
    s
      ?.replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();

  meta.title = decode(meta.title);
  meta.description = decode(meta.description);
  meta.author = decode(meta.author);

  return meta;
}

export type ImportResult = {
  url: string;
  status: "imported" | "needs_review" | "duplicate" | "failed";
  bookId?: string;
  title?: string;
  author?: string;
  message?: string;
  jobId?: string;
};

/** Process a single URL: validate, fetch metadata, detect duplicates, create draft book */
export async function processImportUrl(
  url: string,
  batchId: string
): Promise<ImportResult> {
  // Create job record
  const job = await prisma.importJob.create({
    data: { url, status: "processing", batchId },
  });

  try {
    if (!isSafeUrl(url)) {
      await prisma.importJob.update({
        where: { id: job.id },
        data: { status: "failed", error: "Invalid or blocked URL" },
      });
      return { url, status: "failed", message: "غیر محفوظ یا غلط URL", jobId: job.id };
    }

    // Duplicate by source URL
    const existing = await prisma.book.findFirst({
      where: { sourceUrl: url },
    });
    if (existing) {
      await prisma.importJob.update({
        where: { id: job.id },
        data: {
          status: "duplicate",
          bookId: existing.id,
          metadata: JSON.stringify({ title: existing.title }),
        },
      });
      return {
        url,
        status: "duplicate",
        bookId: existing.id,
        title: existing.title,
        message: "یہ کتاب پہلے سے موجود ہے",
        jobId: job.id,
      };
    }

    // Fetch page (metadata only — timeout + size limit)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let html = "";
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "KitabKhana-Importer/1.0 (metadata only; respectful)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
      clearTimeout(timeout);

      if (!res.ok) {
        await prisma.importJob.update({
          where: { id: job.id },
          data: { status: "failed", error: `HTTP ${res.status}` },
        });
        return {
          url,
          status: "failed",
          message: "سورس دستیاب نہیں",
          jobId: job.id,
        };
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        // Non-HTML: still create metadata record pointing to source
        const title = url.split("/").filter(Boolean).pop() || "External Book";
        const slug = slugify(title) + "-" + createHash("md5").update(url).digest("hex").slice(0, 6);
        const book = await prisma.book.create({
          data: {
            title: decodeURIComponent(title).slice(0, 200),
            slug,
            sourceUrl: url,
            readingUrl: url,
            contentType: "external",
            copyrightStatus: "external",
            status: "draft",
            description: "External source — read at original URL",
          },
        });
        await prisma.importJob.update({
          where: { id: job.id },
          data: {
            status: "needs_review",
            bookId: book.id,
            metadata: JSON.stringify({ title: book.title }),
          },
        });
        return {
          url,
          status: "needs_review",
          bookId: book.id,
          title: book.title,
          message: "میٹا ڈیٹا نامکمل",
          jobId: job.id,
        };
      }

      // Read limited body
      const text = await res.text();
      html = text.slice(0, 500_000); // max 500KB
    } catch (err) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : "Fetch failed";
      await prisma.importJob.update({
        where: { id: job.id },
        data: { status: "failed", error: msg },
      });
      return { url, status: "failed", message: "سورس دستیاب نہیں", jobId: job.id };
    }

    const meta = extractMetadata(html, url);

    if (!meta.title) {
      meta.title = url.split("/").filter(Boolean).pop() || "Untitled";
      try {
        meta.title = decodeURIComponent(meta.title);
      } catch {
        /* keep */
      }
    }

    // Duplicate by title (fuzzy simple match)
    const titleDup = await prisma.book.findFirst({
      where: { title: meta.title },
    });
    if (titleDup) {
      await prisma.importJob.update({
        where: { id: job.id },
        data: {
          status: "duplicate",
          bookId: titleDup.id,
          metadata: JSON.stringify(meta),
        },
      });
      return {
        url,
        status: "duplicate",
        bookId: titleDup.id,
        title: titleDup.title,
        message: "یہ عنوان پہلے سے موجود ہے",
        jobId: job.id,
      };
    }

    // Resolve or create author
    let authorId: string | undefined;
    if (meta.author) {
      const authorSlug = slugify(meta.author);
      const author = await prisma.author.upsert({
        where: { slug: authorSlug },
        update: {},
        create: { name: meta.author, slug: authorSlug },
      });
      authorId = author.id;
    }

    const baseSlug = slugify(meta.title);
    const uniqueSlug =
      baseSlug + "-" + createHash("md5").update(url).digest("hex").slice(0, 6);

    const needsReview = !meta.description || !meta.coverUrl || !meta.author;

    const book = await prisma.book.create({
      data: {
        title: meta.title.slice(0, 300),
        slug: uniqueSlug,
        description: meta.description?.slice(0, 2000) || null,
        coverUrl: meta.coverUrl || null,
        sourceUrl: url,
        readingUrl: url,
        contentType: "external",
        copyrightStatus: "external",
        status: "draft",
        authorId: authorId || null,
      },
    });

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: needsReview ? "needs_review" : "imported",
        bookId: book.id,
        metadata: JSON.stringify(meta),
      },
    });

    return {
      url,
      status: needsReview ? "needs_review" : "imported",
      bookId: book.id,
      title: book.title,
      author: meta.author,
      message: needsReview ? "میٹا ڈیٹا نامکمل — جائزہ لیں" : undefined,
      jobId: job.id,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    await prisma.importJob.update({
      where: { id: job.id },
      data: { status: "failed", error: msg },
    }).catch(() => {});
    return { url, status: "failed", message: "امپورٹ ناکام", jobId: job.id };
  }
}

/** Process multiple URLs sequentially (batches handled by caller) */
export async function processImportBatch(urls: string[], batchId: string) {
  const results: ImportResult[] = [];
  for (const url of urls) {
    const result = await processImportUrl(url, batchId);
    results.push(result);
  }
  return results;
}
