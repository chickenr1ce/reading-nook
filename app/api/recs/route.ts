import { NextRequest, NextResponse } from "next/server";
import { addRec, listRecs } from "@/lib/recs";
import { recCreateSchema, userIdSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const forUser = req.nextUrl.searchParams.get("for");
  const parsedUser = userIdSchema.safeParse(forUser);

  if (!parsedUser.success) {
    return NextResponse.json(
      { error: "query param 'for' is required and must be 'you' or 'her'" },
      { status: 400 }
    );
  }

  const recs = await listRecs(parsedUser.data);
  return NextResponse.json(recs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = recCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const rec = await addRec(result.data);
    return NextResponse.json(rec, { status: 201 });
  } catch (err) {
    console.error("POST /api/recs error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
