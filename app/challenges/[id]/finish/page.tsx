"use client";

import BackButton from "@/components/BackButton";
import { Geojson } from "@/components/Geojson";
import { HiFive } from "@/components/HiFive";
import PrimaryButton from "@/components/PrimaryButton";
import { TopBar } from "@/components/TopBar";
import { ChallengeType } from "@/lib/drizzle/schema";
import { queryClient } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChallengeStateContext } from "../context";
import { WalkData } from "../walk/Map/types";

export default function Finish({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const { walk } = useChallengeStateContext();

  const { data: challenge } = useQuery({
    queryKey: ["challenges", id],
    queryFn: () =>
      fetch(`/api/challenges/${id}`).then(
        async (res) =>
          (await res.json()) as {
            status: "success";
            data: { challenge: ChallengeType };
          },
      ),
  });

  return (
    <div className="relative flex flex-col items-stretch h-full">
      <TopBar backButton={<BackButton onClick={() => router.back()} />}>
        <h1 className="text-3xl text-primary font-display">Walking Finished</h1>
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
          justifyContent: "space-between",
          alignItems: "center",
          gap: "32px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
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
          <HiFive />
        </div>

        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <h4 className="mb-2 text-4xl font-display">Hi-5!</h4>
          <h5 className="text-2xl text-gray-500 font-display">
            Here’s the result of your walking artwork.
          </h5>
        </div>

        <div
          style={{
            flex: "1 1 0%",
            padding: "0 48px",
          }}
        >
          {walk && <Geojson walkData={walk.data as WalkData} />}
        </div>

        {challenge &&
          (challenge.data.challenge.type === "competitive" ? (
            <Link href={`/challenges/${id}/similarity`}>
              <PrimaryButton>Check Similarity</PrimaryButton>
            </Link>
          ) : (
            <PrimaryButton
              onClick={async () => {
                if (!walk) return;
                await fetch(`/api/challenges/${id}/walks/${walk.userAddr}`, {
                  method: "PATCH",
                  body: JSON.stringify({
                    ...walk,
                    status: "submitted",
                  }),
                });
                queryClient.refetchQueries([
                  "challenges",
                  id,
                  "walks",
                  walk.userAddr,
                ]);
                queryClient.refetchQueries(["challenges", id]);
                router.push(`/challenges/${id}/mint-nft`);
              }}
            >
              Create NFT
            </PrimaryButton>
          ))}
      </div>
    </div>
  );
}
