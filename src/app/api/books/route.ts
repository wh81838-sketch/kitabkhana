import { NextResponse } from "next/server";
import { getPublishedBooks } from "@/lib/books";
import { demoBooks } from "@/data/demo-books";

export async function GET() {
  try {
    const books = await getPublishedBooks();
    if (books.length > 0) {
      return NextResponse.json({ books });
    }
  } catch {
    /* fall through */
  }
  return NextResponse.json({ books: demoBooks });
}
