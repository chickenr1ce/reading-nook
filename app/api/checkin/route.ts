import { NextRequest, NextResponse } from "next/server";
import { checkIn, getTodayStatus, getStreaks, getMonthCheckins, resetCheckins } from "@/lib/checkin";
import type { UserId } from "@/types";

export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get("month"); // "YYYY-MM"

  const [status, streaks] = await Promise.all([getTodayStatus(), getStreaks()]);

  const response: Record<string, unknown> = { status, streaks };

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    response.month = await getMonthCheckins(month);
  }

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.userId || (body.userId !== "you" && body.userId !== "her")) {
    return NextResponse.json(
      { error: "userId must be 'you' or 'her'" },
      { status: 400 }
    );
  }

  const result = await checkIn(body.userId as UserId);
  const [status, streaks] = await Promise.all([getTodayStatus(), getStreaks()]);
  return NextResponse.json({ checkIn: result, status, streaks }, { status: 201 });
}

export async function DELETE() {
  await resetCheckins();
  return NextResponse.json({ ok: true });
}
