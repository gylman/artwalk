"use client";

import SecondaryButton from "@/components/SecondaryButton";
import { env } from "@/env";
import { useNow } from "@/hooks/useNow";
import { challenges, ChallengeType } from "@/lib/drizzle/schema";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useContext, useMemo } from "react";
import Card from "../Card";
import { FilterContext } from "../FilterContext";

export const runtime = "edge";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Competitive() {
  const { data } = useQuery({
    queryKey: ["challenges"],
    queryFn: () =>
      fetch(`/api/challenges`).then(
        async (res) =>
          (await res.json()) as { success: boolean; data: ChallengeType[] },
      ),
  });

  const now = useNow();
  const { value } = useContext(FilterContext);
  const rows = (data?.data ?? []).filter(
    (challenge) =>
      challenge.type === "competitive" &&
      (value.difficulty === "all" ||
        value.difficulty === challenge.difficulty) &&
      (value.pricing === "all" || value.pricing === challenge.pricing) &&
      value.status !== "done" &&
      new Date(challenge.deadline!).getTime() >= now,
  );
  const rows2 = (data?.data ?? []).filter(
    (challenge) =>
      challenge.type === "competitive" &&
      (value.difficulty === "all" ||
        value.difficulty === challenge.difficulty) &&
      (value.pricing === "all" || value.pricing === challenge.pricing) &&
      value.status !== "in progress" &&
      new Date(challenge.deadline!).getTime() < now,
  );

  return (
    <>
      {env.NEXT_PUBLIC_NODE_ENV !== "production" && (
        <div className="flex flex-col gap-2 p-3 mb-6 border border-primary-200 rounded-2xl">
          <p className="text-center">Testing tools</p>
          <div>
            <SecondaryButton
              onClick={async () => {
                await fetch(`/api/create/competitive`, { method: "POST" });
                location.reload();
              }}
              className="!h-7 !px-3 !text-sm !w-fit !inline-block !mr-3"
            >
              Create random challenge
            </SecondaryButton>
            <SecondaryButton
              onClick={async () => {
                const id = rows.at(0)?.id;
                if (id !== undefined) {
                  await fetch(`/api/challenges/${id}/close`, {
                    method: "POST",
                  });
                  location.reload();
                }
              }}
              className="!h-7 !px-3 !text-sm !w-fit !inline-block"
            >
              Close first challenge
            </SecondaryButton>
          </div>
        </div>
      )}

      {rows.map((challenge) => (
        <li key={challenge.id} className="contents">
          <Item challenge={challenge} />
        </li>
      ))}
      {[...rows2].reverse().map((challenge) => (
        <li key={challenge.id} className="contents">
          <Item challenge={challenge} />
        </li>
      ))}
    </>
  );
}

function Item({ challenge }: { challenge: ChallengeType }) {
  const now = useNow();
  const date = useMemo(
    () => new Date(challenge.deadline ?? 0),
    [challenge.deadline],
  );

  return (
    <Link
      href={
        date.getTime() < now
          ? `/challenges/${challenge.id}/results`
          : `/challenges/${challenge.id}/walk`
      }
    >
      <Card
        ended={date.getTime() < now}
        title={challenge.title}
        imageUrl={challenge.imageUrl ?? ""}
        participantCount={challenge.participantCount}
        pricing={challenge.pricing}
        table={[
          { key: "difficulty", value: challenge.difficulty! },
          {
            key: "deadline",
            value: date,
          },
        ]}
      />
    </Link>
  );
}
