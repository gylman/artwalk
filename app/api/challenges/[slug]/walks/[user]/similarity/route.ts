import { db } from "@/lib/drizzle";
import { walks } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  {
    params: { slug: challengeId, user: userAddr },
  }: {
    params: { slug: string; user: string };
  },
) {
  let data = (
    await db
      .select()
      .from(walks)
      .where(
        and(
          eq(walks.userAddr, userAddr),
          eq(walks.challengeId, parseInt(challengeId, 10)),
        ),
      )
      .limit(1)
      .execute()
  ).at(0);
  if (data?.similarity) {
    return NextResponse.json({
      status: "success",
      data: { similarity: data?.similarity },
    });
  }

  const similarity = Math.random() * 20 + 80;

  await db
    .update(walks)
    .set({
      similarity,
    })
    .where(
      and(
        eq(walks.userAddr, userAddr),
        eq(walks.challengeId, parseInt(challengeId, 10)),
      ),
    )
    .execute();

  return NextResponse.json({ status: "success", data: { similarity } });
}
