import type { WalkData } from "@/app/challenges/[id]/walk/Map/types";
import { db } from "@/lib/drizzle";
import { challenges, nfts, walks } from "@/lib/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(
  _: Request,
  {
    params: { slug: challengeId },
  }: {
    params: { slug: string };
  },
) {
  try {
    let data =
      (
        await db
          .select()
          .from(challenges)
          .where(eq(challenges.id, parseInt(challengeId, 10)))
          .limit(1)
          .execute()
      ).at(0) ?? null;
    if (!data) throw new Error("not found");
    if (new Date(data.deadline!).getTime() < Date.now() - 10_000)
      throw new Error("deadline passed");

    let submissions = await db
      .select()
      .from(walks)
      .where(
        and(
          eq(walks.challengeId, parseInt(challengeId, 10)),
          eq(walks.status, "submitted"),
        ),
      )
      .execute();

    const genRanHex = (size: number) =>
      [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    const genRanWalkData = (): WalkData => ({
      paths: [
        {
          styleIndex: 0,
          datapoints: Array.from(
            { length: 100 + Math.floor(Math.random() * 20) },
            (_, i) => i,
          ).map((i, _, arr) => ({
            timestamp:
              Math.floor((i + Math.random() * 0.05) * 4000) +
              Date.now() -
              1000000,
            location: [
              132 +
                (0.001 + Math.random() * 0.0002) *
                  Math.cos(
                    (i / arr.length) *
                      (2 * Math.PI) *
                      (1 + Math.random() * 0.1),
                  ) +
                Math.random() * 0.0004,
              37 +
                (0.001 + Math.random() * 0.0002) *
                  Math.sin(
                    (i / arr.length) *
                      (2 * Math.PI) *
                      (1 + Math.random() * 0.1),
                  ) +
                Math.random() * 0.0004,
            ],
          })),
        },
      ],
      styles: [
        {
          lineWidth: 10,
          color: {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
          },
        },
      ],
      states: {
        isPaused: false,
      },
    });

    const dummyLength = Math.max(0, 3 - submissions.length);
    for (let i = 0; i < dummyLength; i++) {
      await db
        .insert(walks)
        .values({
          updatedAt: new Date(Date.now() - Math.floor(Math.random() * 100_000)),
          userAddr: `0x${genRanHex(16)}`,
          challengeId: parseInt(challengeId, 10),
          status: "submitted",
          data: genRanWalkData(),
          similarity: Math.random() * 90,
          totalLength: 0,
          drawnLength: 0,
          totalTime: 0,
          drawnTime: 0,
        })
        .execute();
    }

    if (dummyLength > 0) {
      submissions = await db
        .select()
        .from(walks)
        .where(
          and(
            eq(walks.challengeId, parseInt(challengeId, 10)),
            eq(walks.status, "submitted"),
          ),
        )
        .execute();
    }

    submissions.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
    for (let i = 0; i < 3; i++) {
      await db
        .insert(nfts)
        .values({
          userAddr: submissions[i].userAddr,
          walkId: submissions[i].id,
          rank: i + 1,
        })
        .execute();
      const nft = (
        await db
          .select()
          .from(nfts)
          .where(eq(nfts.walkId, submissions[i].id))
          .limit(1)
          .execute()
      ).at(0)!;
      await db
        .update(walks)
        .set({
          nftId: nft.id,
        })
        .where(eq(walks.id, submissions[i].id))
        .execute();
    }

    await db
      .update(challenges)
      .set({
        deadline: new Date(),
        participantCount: Math.max(data.participantCount, submissions.length),
      })
      .where(eq(challenges.id, parseInt(challengeId, 10)));

    return NextResponse.json({ status: "success", data: submissions });
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
