import { db } from "@/lib/drizzle";
import { challenges, walks } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  {
    params: { slug: challengeId },
  }: {
    params: { slug: string };
  },
) {
  try {
    let challenge =
      (
        await db
          .select()
          .from(challenges)
          .where(eq(challenges.id, parseInt(challengeId, 10)))
          .limit(1)
          .execute()
      ).at(0) ?? null;
    if (!challenge) throw new Error("not found");
    const submissions = await db
      .select()
      .from(walks)
      .where(
        and(
          eq(walks.challengeId, parseInt(challengeId, 10)),
          eq(walks.status, "submitted"),
        ),
      )
      .execute();

    return NextResponse.json({
      status: "success",
      data: {
        challenge,
        submissions,
      },
    });
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
