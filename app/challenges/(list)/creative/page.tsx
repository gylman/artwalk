"use client";

import SecondaryButton from "@/components/SecondaryButton";
import { ChallengeType } from "@/lib/drizzle/schema";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Card from "../Card";

export const runtime = "edge";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Creative() {
  const { data } = useQuery({
    queryKey: ["challenges"],
    queryFn: () =>
      fetch(`/api/challenges`).then(
        async (res) =>
          (await res.json()) as { success: boolean; data: ChallengeType[] },
      ),
  });

  return (
    <>
      <div className="flex flex-col gap-2 p-3 mb-6 border border-primary-200 rounded-2xl">
        <p className="text-center">Testing tools</p>
        <div>
          <SecondaryButton
            onClick={async () => {
              await fetch(`/api/create/creative`, { method: "POST" });
              location.reload();
            }}
            className="!h-7 !px-3 !text-sm !w-fit !inline-block !mr-3"
          >
            Create random challenge
          </SecondaryButton>
          <SecondaryButton
            onClick={async () => {
              const id = data?.data
                .filter(
                  (challenge) =>
                    challenge.type === "creative" &&
                    new Date(challenge.deadline!).getTime() >= Date.now(),
                )
                .at(0)?.id;
              if (id !== undefined) {
                await fetch(`/api/challenges/${id}/close`, { method: "POST" });
                location.reload();
              }
            }}
            className="!h-7 !px-3 !text-sm !w-fit !inline-block"
          >
            Close first challenge
          </SecondaryButton>
        </div>
      </div>

      {data?.data
        .filter(
          (challenge) =>
            challenge.type === "creative" &&
            new Date(challenge.deadline!).getTime() >= Date.now(),
        )
        .map((challenge) => (
          <li key={challenge.id} className="contents">
            <Item challenge={challenge} />
          </li>
        ))}
      {[
        ...(data?.data.filter(
          (challenge) =>
            challenge.type === "creative" &&
            new Date(challenge.deadline!).getTime() < Date.now(),
        ) ?? []),
      ]
        .reverse()
        .map((challenge) => (
          <li key={challenge.id} className="contents">
            <Item challenge={challenge} />
          </li>
        ))}
    </>
  );
}

function Item({ challenge }: { challenge: ChallengeType }) {
  return (
    <Link href={`/challenges/${challenge.id}/walk`}>
      <Card
        title={challenge.title}
        imageUrl={challenge.imageUrl ?? ""}
        participantCount={challenge.participantCount}
        pricing={challenge.pricing}
        table={[]}
      />
    </Link>
  );
}
