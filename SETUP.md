# کتب خانہ — Setup Guide

## Quick Start (on your machine)

```bash
cd urdu-adab-library
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open http://localhost:3000

Admin login (demo): http://localhost:3000/admin/login

## What's already built

### Phase 1 — Design + Public Site
- Premium literary theme (burgundy / cream / gold)
- Full RTL + Noto Nastaliq Urdu
- Homepage (Hero, Personal Note, Continue Reading, Featured, Categories, Authors)
- Library (search, category filter, grid/list)
- Book detail
- Distraction-free Reader (Light / Sepia / Dark + font size)
- Search, Favorites, Profile
- Mobile bottom navigation (Median.co ready)

### Phase 2 — Database
- Prisma schema: users, books, authors, categories, reading_progress, favorites, bookmarks, import_jobs, settings
- Seed script with classic Urdu demo books

### Phase 3–5 UI
- /admin/login
- Admin dashboard + sidebar
- Bulk URL Importer (multi-line paste → progress → review table)

## Static Prototype (works immediately)

Open:
  urdu-adab-library-static/index.html
or serve:
  cd urdu-adab-library-static && python3 -m http.server 8765

## Next development steps after install

1. Wire pages to Prisma instead of demo-books.ts
2. Add NextAuth / credentials for admin
3. Implement real bulk importer backend (metadata fetch, cover, duplicates)
4. Reading progress + favorites persistence
5. Settings page (library name, tagline, personal greeting)

## Prisma wiring (done)

Public pages now query the database via `src/lib/books.ts`:

- Homepage → featured, recent, categories, authors, settings
- Library → all published books + category filter
- Book detail → single book + related
- Search → client filter + `/api/books`
- Favorites → featured (until auth)
- Admin dashboard → live counts

If the database is empty or Prisma is unavailable, pages automatically fall back to demo data so the UI never breaks.

After `npm run db:setup`, the site will serve real seeded content.

## Admin Authentication

- Login: http://localhost:3000/admin/login
- Default credentials (from seed):
  - Email: `admin@kitabkhana.local`
  - Password: `admin123`
- Session: HTTP-only signed cookie (7 days)
- Middleware protects all `/admin/*` routes except login
- Logout via sidebar button

Set `AUTH_SECRET` in `.env` for production.

## Bulk URL Importer

- Page: `/admin/import`
- API: `POST /api/admin/import-books` (admin only)
- Body: `{ "urls": ["https://...", ...] }` (max 200)
- Features:
  - SSRF protection (blocks private/internal hosts)
  - Open Graph / meta tag extraction (title, author, description, cover)
  - Duplicate detection (source URL + title)
  - Creates **draft** books with `contentType: external` (no copyrighted content copied)
  - Import job records in `import_jobs` table
  - Status: imported | needs_review | duplicate | failed

## Publish / Unpublish

- **Admin books page:** `/admin/books`
  - Filter: all / published / draft / archived
  - Single-click publish or unpublish per row
  - Bulk: select books → Publish / Unpublish / Archive / Feature / Delete
- **API:** `PATCH /api/admin/books` with `{ ids: string[], action: "publish"|"unpublish"|"archive"|"feature"|"unfeature"|"delete" }`
- **Single book:** `PATCH /api/admin/books/[id]` with `{ status, featured, ... }`
- **Add book:** `/admin/books/add` (draft or publish immediately)
- **After import:** "سب شائع کریں" publishes all imported/needs_review drafts

Only `status: "published"` books appear on the public library.
