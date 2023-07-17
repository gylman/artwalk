import { db } from "@/lib/drizzle";
import { challenges, nfts, walks } from "@/lib/drizzle/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(_: Request) {
  try {
    let data = await db
      .select()
      .from(challenges)
      .orderBy(asc(challenges.deadline))
      .execute();
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "failed",
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
