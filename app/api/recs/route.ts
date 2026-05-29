import { NextRequest, NextResponse } from "next/server";
import { addRec, listRecs } from "@/lib/recs";
import type { RecInput } from "@/types";

export async function GET(req: NextRequest) {
  const forUser = req.nextUrl.searchParams.get("for") as "you" | "her";
  if (!forUser) {
    return NextResponse.json(
      { error: "query param 'for' is required (you or her)" },
      { status: 400 }
    );
  }
  const recs = await listRecs(forUser);
  return NextResponse.json(recs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.from || !body.to || !body.bookTitle || !body.bookAuthor) {
    return NextResponse.json(
      { error: "from, to, bookTitle, and bookAuthor are required" },
      { status: 400 }
    );
  }

  const input: RecInput = {
    from: body.from,
    to: body.to,
    bookTitle: body.bookTitle,
    bookAuthor: body.bookAuthor,
    note: body.note ?? "",
  };

  const rec = await addRec(input);
  return NextResponse.json(rec, { status: 201 });
}
