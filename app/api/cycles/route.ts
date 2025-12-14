import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const cycles = await prisma.studyCycle.findMany({
    orderBy: { date: "desc" }
  });

  const serialized = cycles.map((cycle) => ({
    ...cycle,
    date: cycle.date.toISOString()
  }));

  return NextResponse.json(serialized);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<{ subjectId: number; accuracy: number }>;

  if (typeof body.subjectId !== "number" || typeof body.accuracy !== "number") {
    return NextResponse.json({ error: "subjectId と accuracy は必須です" }, { status: 400 });
  }

  const created = await prisma.studyCycle.create({
    data: {
      subjectId: body.subjectId,
      accuracy: body.accuracy,
      date: new Date()
    }
  });

  return NextResponse.json(
    {
      ...created,
      date: created.date.toISOString()
    },
    { status: 201 }
  );
}
