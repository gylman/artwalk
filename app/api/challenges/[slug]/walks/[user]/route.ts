import { db } from "@/lib/drizzle";
import { challenges, nfts, walks } from "@/lib/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  _: Request,
  {
    params: { slug: challengeId, user: userAddr },
  }: {
    params: { slug: string; user: string };
  },
) {
  try {
    let data = (
      await db
        .select()
        .from(walks)
        .leftJoin(nfts, eq(walks.nftId, nfts.id))
        .leftJoin(challenges, eq(walks.challengeId, challenges.id))
        .where(
          and(
            eq(walks.userAddr, userAddr),
            eq(walks.challengeId, parseInt(challengeId, 10)),
          ),
        )
        .limit(1)
        .execute()
    ).at(0);
    if (!data) {
      data = {
        challenges:
          (
            await db
              .select()
              .from(challenges)
              .where(eq(challenges.id, parseInt(challengeId, 10)))
              .limit(1)
              .execute()
          ).at(0) ?? null,
        nfts: null,
        walks: null!,
      };
    }

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

export async function POST(
  request: Request,
  {
    params: { slug: challengeId, user: userAddr },
  }: {
    params: { slug: string; user: string };
  },
) {
  try {
    await db.transaction(async (tx) => {
      await tx.insert(walks).values({
        updatedAt: new Date(),
        userAddr,
        challengeId: parseInt(challengeId, 10),
        status: "in progress",
        data: {
          styles: [],
          paths: [],
          states: {
            isPaused: false,
          },
        },
        totalLength: 0,
        drawnLength: 0,
        totalTime: 0,
        drawnTime: 0,
      });
      await tx
        .update(challenges)
        .set({
          participantCount: sql`${challenges.participantCount} + 1`,
        })
        .where(eq(challenges.id, parseInt(challengeId, 10)));
    });

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

export async function PATCH(
  request: Request,
  {
    params: { slug: challengeId, user: userAddr },
  }: {
    params: { slug: string; user: string };
  },
) {
  // TODO: validation
  const body = await request.json();
  body.updatedAt = new Date(body.updatedAt);

  try {
    await db
      .update(walks)
      .set({ ...body })
      .where(
        and(
          eq(walks.userAddr, userAddr),
          eq(walks.challengeId, parseInt(challengeId, 10)),
        ),
      );

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
