import { db } from "@/lib/drizzle";
import { challenges, nfts, walks } from "@/lib/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(
  _: Request,
  { params: { id } }: { params: { id: string } },
) {
  try {
    await db
      .update(nfts)
      .set({
        claimed: true,
      })
      .where(eq(nfts.id, parseInt(id, 10)))
      .execute();
    return NextResponse.json({ status: "success" });
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
