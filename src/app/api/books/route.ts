import { NextResponse } from "next/server";
import { getPublishedBooks } from "@/lib/books";

export async function GET() {
  try {
    const books = await getPublishedBooks();
    return NextResponse.json({ books });
  } catch (e) {
    console.error("API books error:", e);
    return NextResponse.json({ books: [] });
  }
}
