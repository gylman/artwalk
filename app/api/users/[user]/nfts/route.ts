import { db } from "@/lib/drizzle";
import { challenges, nfts, walks } from "@/lib/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  _: Request,
  { params: { user } }: { params: { user: string } },
) {
  try {
    let data = await db
      .select()
      .from(nfts)
      .leftJoin(walks, eq(nfts.walkId, walks.id))
      .leftJoin(challenges, eq(walks.challengeId, challenges.id))
      .where(eq(nfts.userAddr, user))
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
