import { NextRequest, NextResponse } from "next/server";
import { markRecRead } from "@/lib/recs";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json({ error: "Missing or invalid id parameter" }, { status: 400 });
  }

  const ok = await markRecRead(id.trim());
  if (!ok) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
