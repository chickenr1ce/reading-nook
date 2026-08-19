import { NextRequest, NextResponse } from "next/server";
import { getBook, updateBook, deleteBook } from "@/lib/books";
import { bookUpdateSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

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
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const result = bookUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const book = await updateBook(id, result.data);

    if (!book) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (err) {
    console.error("PATCH /api/books/[id] error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
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
