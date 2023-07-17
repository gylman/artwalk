import { db } from "@/lib/drizzle";
import { nfts } from "@/lib/drizzle/schema";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const { userAddr, walkId } = await request.json();

  try {
    await db
      .insert(nfts)
      .values({
        userAddr,
        walkId,
        claimed: true,
      })
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
