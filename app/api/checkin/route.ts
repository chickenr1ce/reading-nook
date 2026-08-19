import { NextRequest, NextResponse } from "next/server";
import { checkIn, getTodayStatus, getStreaks, getMonthCheckins, resetCheckins } from "@/lib/checkin";
import { checkinCreateSchema, checkinMonthQuerySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const rawMonth = req.nextUrl.searchParams.get("month");
  const parsedQuery = checkinMonthQuerySchema.safeParse({ month: rawMonth });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid month query format. Must be YYYY-MM." },
      { status: 400 }
    );
  }

  const month = parsedQuery.data.month;
  const [status, streaks] = await Promise.all([getTodayStatus(), getStreaks()]);

  const response: Record<string, unknown> = { status, streaks };

  if (month) {
    response.month = await getMonthCheckins(month);
  }

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = checkinCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const checkinResult = await checkIn(result.data.userId);
    const [status, streaks] = await Promise.all([getTodayStatus(), getStreaks()]);
    return NextResponse.json({ checkIn: checkinResult, status, streaks }, { status: 201 });
  } catch (err) {
    console.error("POST /api/checkin error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

export async function DELETE() {
  await resetCheckins();
  return NextResponse.json({ ok: true });
}
