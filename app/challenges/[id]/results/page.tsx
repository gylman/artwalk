"use client";

import BackButton from "@/components/BackButton";
import { Geojson } from "@/components/Geojson";
import { Medal } from "@/components/Medal";
import PrimaryButton from "@/components/PrimaryButton";
import { TopBar } from "@/components/TopBar";
import useCurrentUser from "@/hooks/useCurrentUser";
import type { ChallengeType, NFTType, WalkType } from "@/lib/drizzle/schema";
import { animated, useSpring } from "@react-spring/web";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { WalkData } from "../walk/Map/types";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function Results({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const user = useCurrentUser();

  const { data } = useQuery({
    queryKey: ["challenges", id],
    queryFn: () =>
      fetch(`/api/challenges/${id}`).then(
        async (res) =>
          (await res.json()) as {
            status: "success";
            data: { challenge: ChallengeType; submissions: WalkType[] };
          },
      ),
  });
  const rank = useMemo(
    () =>
      data?.data.submissions
        .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
        .findIndex((x) => x.userAddr === user?.addr) ?? -1,
    [data, user],
  );
  const walkData = useMemo(
    () =>
      data?.data.submissions.find((x) => x.userAddr === user?.addr)?.data as
        | WalkData
        | undefined,
    [data, user],
  );

  return (
    <div className="relative flex flex-col items-stretch h-full">
      <TopBar backButton={<BackButton onClick={() => router.back()} />}>
        <h1 className="text-3xl text-primary font-display">
          {rank < 0 ? "Results" : rank < 3 ? "Congrats!" : "Good Walk!"}
        </h1>
      </TopBar>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          paddingTop: "24px",
          paddingBottom: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {rank >= 0 && (
          <UserRank
            id={id}
            title={data?.data.challenge.title ?? ""}
            rank={rank + 1}
            walkData={walkData}
          />
        )}
      </div>
    </div>
  );
}

function UserRank({
  rank,
  title,
  id,
  walkData,
}: {
  rank: number;
  title: string;
  id: string;
  walkData?: WalkData;
}) {
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

  const entry = useMemo(() => {
    return nfts?.data.find(
      ({ challenges }) => challenges.id === parseInt(id as string, 10),
    );
  }, [nfts, id]);
  const nftClaimed = entry?.nfts.claimed;

  const [medal, medalApi] = useSpring(() => ({
    from: { t: 0 },
    to: { t: 1 },
    delay: 300,
  }));
  const [mainText, mainTextApi] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 700,
  }));
  const [other, otherApi] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1000,
  }));

  useEffect(() => {
    medalApi.start();
  }, [medalApi]);

  return (
    <>
      <animated.div
        style={{
          backgroundColor: "#9afcc5",
          color: "#7135C7",
          width: "144px",
          height: "144px",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          position: "relative",
          transform: medal.t.to(
            (t) => `rotateZ(${-180 * (1 - t)}deg) scale(${t})`,
          ),
        }}
      >
        <Medal />
        <span
          className="uppercase font-display"
          style={{
            position: "absolute",
            top: "62px",
            fontSize: "30px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {rank}
        </span>
      </animated.div>

      <animated.div
        style={{ textAlign: "center", padding: "0 24px", ...mainText }}
      >
        <h4 className="mb-2 text-4xl font-display">
          {rank === 1 ? (
            "You are the winner!"
          ) : (
            <>
              You ranked {rank}
              <sup>{["th", "st", "nd", "rd"][rank]}</sup>!
            </>
          )}
        </h4>
        <h5 className="text-2xl text-gray-500 font-display">
          {rank === 1 ? (
            <>Your {title} walking artwork had the most similarity.</>
          ) : (
            <>
              Your {title} walking artwork ranked {rank}
              <sup>{["th", "st", "nd", "rd"][rank]}</sup>.
            </>
          )}
        </h5>
      </animated.div>

      {rank >= 0 && rank < 3 && (
        <animated.div
          className="flex flex-col items-center gap-6"
          style={other}
        >
          {walkData && <Geojson walkData={walkData} />}
          <Link
            href={nftClaimed ? "/profiles" : `/challenges/${id}/mint-nft`}
            className="mx-auto"
          >
            <PrimaryButton>
              {nftClaimed ? "See my NFT" : "Mint NFT"}
            </PrimaryButton>
          </Link>
        </animated.div>
      )}
    </>
  );
}
