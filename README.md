# کتب خانہ — Urdu Adab Digital Library

A premium, elegant, private digital library for Urdu novels and literature.

**Tagline:** جہاں ہر کتاب ایک نئی دنیا ہے

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** + SQLite (easy upgrade to PostgreSQL)
- **Noto Nastaliq Urdu** typography
- Mobile-first design ready for Median.co wrapping

## Features (Current)

### Reader Experience
- Beautiful RTL homepage with cinematic hero
- Library with search, category filters, grid/list views
- Book detail pages
- Distraction-free reader (Light / Sepia / Dark + font size)
- Favorites, Continue Reading, reading progress
- Mobile bottom navigation

### Admin (Coming)
- Secure admin login
- Bulk URL book importer
- Metadata + cover extraction
- Category & author management
- Settings (library name, logo, tagline, personal greeting)

## Getting Started

```bash
cd urdu-adab-library
npm install

# Database
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  app/           # Pages (home, library, book, reader, search, favorites, profile)
  components/    # UI components
  data/          # Demo data (will be replaced by DB)
  lib/           # Prisma client, utilities
prisma/
  schema.prisma  # Full database schema
  seed.ts        # Demo content seeder
```

## Design Tokens

- Deep burgundy (`#4a1c24`)
- Warm cream (`#fdfbf7`)
- Muted gold (`#b8922e`)
- Charcoal text

## Development Phases

1. ✅ Core design system + responsive website
2. 🔄 Database + books + categories + authors
3. Admin authentication
4. Admin dashboard
5. Bulk URL importer
6. Metadata & cover processing
7. Search / filtering (DB-powered)
8. Full reader enhancements
9. Settings, personalization, Median.co polish

## Copyright Note

This system never scrapes or stores copyrighted book content without authorization.
The importer creates metadata records and links to legal sources when full content cannot be imported.
