import { NextRequest, NextResponse } from "next/server";
import { getBook, updateBook, deleteBook } from "@/lib/books";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (body.rating !== undefined && (body.rating < 0 || body.rating > 5)) {
    return NextResponse.json(
      { error: "rating must be between 0 and 5" },
      { status: 400 }
    );
  }

  const book = await updateBook(id, {
    title: body.title,
    author: body.author,
    status: body.status,
    rating: body.rating,
    notes: body.notes,
    coverUrl: body.coverUrl,
  });

  if (!book) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteBook(id);
  if (!ok) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
