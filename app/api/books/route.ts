import { NextRequest, NextResponse } from "next/server";
import { addBook, listBooks } from "@/lib/books";
import type { BookInput } from "@/types";

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("owner") as "you" | "her" | null;
  const books = await listBooks(owner ?? undefined);
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.title || !body.author || !body.owner) {
    return NextResponse.json(
      { error: "title, author, and owner are required" },
      { status: 400 }
    );
  }

  if (body.rating !== undefined && (body.rating < 0 || body.rating > 5)) {
    return NextResponse.json(
      { error: "rating must be between 0 and 5" },
      { status: 400 }
    );
  }

  const input: BookInput = {
    title: body.title,
    author: body.author,
    coverUrl: body.coverUrl,
    status: body.status,
    rating: body.rating,
    notes: body.notes,
    owner: body.owner,
  };

  const book = await addBook(input);
  return NextResponse.json(book, { status: 201 });
}
