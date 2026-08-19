import { NextRequest, NextResponse } from "next/server";
import { addBook, listBooks } from "@/lib/books";
import { bookCreateSchema, userIdSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const rawOwner = req.nextUrl.searchParams.get("owner");
  const ownerResult = userIdSchema.optional().nullable().safeParse(rawOwner || undefined);

  if (!ownerResult.success) {
    return NextResponse.json(
      { error: "Invalid owner query parameter. Must be 'you' or 'her'." },
      { status: 400 }
    );
  }

  const books = await listBooks(ownerResult.data ?? undefined);
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = bookCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const book = await addBook(result.data);
    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    console.error("POST /api/books error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
