"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import type { ChallengeType, NFTType, WalkType } from "@/lib/drizzle/schema";
import { capitalize } from "@/utils/string";
import { IconUser, IconUsers } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import useRipple from "use-ripple-hook";
import { WalkData } from "../challenges/[id]/walk/Map/types";
import { walkDataToSvg } from "../challenges/[id]/walk/Map/utils";

export default function Profile() {
  const router = useRouter();
  const user = useCurrentUser();

  const { data: nfts } = useQuery({
    queryKey: ["users", user?.addr, "nfts"],
    queryFn: () =>
      !user?.addr
        ? undefined
        : fetch(`/api/users/${user.addr}/nfts`).then(
            async (res) =>
              (await res.json()) as {
                status: "success";
                data: {
                  nfts: NFTType;
                  walks: WalkType;
                  challenges: ChallengeType;
                }[];
              },
          ),
    enabled: !!user?.addr,
  });

  return (
    <div className="relative flex flex-col items-stretch h-full">
      <div className="relative flex flex-col items-center w-full h-full gap-6 px-6 pt-12 pb-20 overflow-y-auto">
        <div
          style={{
            backgroundColor: "#9afcc5",
            color: "#7135C7",
            width: "144px",
            height: "144px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <IconUser size={72} />
        </div>

        <h4 className="mb-2 text-2xl font-display text-primary">
          {user?.addr}
        </h4>

        <h4 className="w-full mb-2 text-2xl font-medium text-left font-display">
          My NFTs
        </h4>
        {nfts?.data
          .filter(({ nfts }) => nfts.claimed)
          .map(({ nfts, walks, challenges }) => (
            <NFTDisplay
              key={nfts.id}
              nfts={nfts}
              walks={walks}
              challenges={challenges}
            />
          ))}
      </div>
    </div>
  );
}

function NFTDisplay({
  nfts,
  walks,
  challenges,
}: {
  nfts: NFTType;
  walks: WalkType;
  challenges: ChallengeType;
}) {
  const [ripple, event] = useRipple();
  const { svg } = useMemo(
    () => walkDataToSvg(walks.data as WalkData),
    [walks.data],
  );

  return (
    <button
      ref={ripple}
      onPointerDown={event}
      className={`w-full p-2 pb-0 text-left text-white shadow-lg outline-none select-none rounded-2xl bg-primary overflow-clip shadow-primary-900/25 focus:outline-none`}
    >
      <section className="h-48 bg-white rounded-lg overflow-clip">
        <div
          className="object-contain object-center w-full h-48 pointer-events-none select-none"
          dangerouslySetInnerHTML={{
            __html: svg,
          }}
        />
      </section>
      <article className="p-4">
        <div className="flex items-center h-8 mb-2">
          <h3 className="flex-1 min-w-0 text-2xl font-medium truncate font-display">
            {challenges.title}
          </h3>
          {challenges.participantCount !== null && (
            <section
              className={`flex items-center gap-1 font-medium text-primary-200`}
            >
              <IconUsers aria-label="number of participants" size={20} />
              <span>{challenges.participantCount}</span>
            </section>
          )}
        </div>
        <section
          className={`grid grid-cols-[4rem_1fr] text-primary-200`}
          style={{
            gridTemplateRows: `repeat(2, 1.75rem)`,
          }}
        >
          {nfts.rank && (
            <>
              <span>Difficulty</span>
              <span className="font-medium text-right">
                {capitalize(challenges.difficulty ?? "")}
              </span>
            </>
          )}
          <span>Similarity</span>
          <span className="font-medium text-right">
            {(walks.similarity ?? 0).toFixed(0)}%
          </span>
          <span className="col-span-2 uppercase text-secondary">
            {nfts.rank ? (
              <>
                {nfts.rank}
                {["", "st", "nd", "rd"][nfts.rank]} place
              </>
            ) : (
              "Creative mode"
            )}
          </span>
        </section>
      </article>
    </button>
  );
}
