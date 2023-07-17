"use client";

import { Geojson } from "@/components/Geojson";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { TopBar } from "@/components/TopBar";
import useCurrentUser from "@/hooks/useCurrentUser";
import { queryClient } from "@/lib/query";
import { IconLoader2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useWindowSize from "react-use/lib/useWindowSize";
import { useChallengeStateContext } from "../context";
import { WalkData } from "../walk/Map/types";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function Similarity({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = useCurrentUser();

  const { isFetched, data, refetch } = useQuery({
    queryKey: ["challenges", id, "walks", user?.addr, "similarity"],
    queryFn: () =>
      !user?.addr
        ? undefined
        : fetch(`/api/challenges/${id}/walks/${user.addr}/similarity`).then(
            async (res) =>
              (await res.json()) as {
                status: "success";
                data: { similarity: number };
              },
          ),
    enabled: !!user?.addr,
  });

  return (
    <div className="relative flex flex-col items-stretch h-full">
      <TopBar>
        <h1 className="pl-2 text-3xl text-primary font-display">
          {data?.data.similarity === undefined ? "Hold On, Walker" : "Amazing!"}
        </h1>
      </TopBar>

      {data?.data.similarity === undefined ? (
        <Checking />
      ) : (
        <SimilarityDisplay id={id} similarity={data.data.similarity} />
      )}
    </div>
  );
}

function Checking() {
  const { walk } = useChallengeStateContext();

  return (
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
        <IconLoader2 size={72} className="animate-spin" />
      </div>

      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <h4 className="mb-2 text-4xl font-display">AI in Progress</h4>
        <h5 className="text-2xl text-gray-500 font-display">
          Our AI companion is analysing the similarity.
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

      <PrimaryButton disabled>Checking Similarity...</PrimaryButton>
    </div>
  );
}

function SimilarityDisplay({
  id,
  similarity,
}: {
  id: string;
  similarity: number;
}) {
  const { walk } = useChallengeStateContext();
  const { width, height } = useWindowSize();
  const router = useRouter();

  return (
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
      <Confetti
        style={{
          position: "fixed",
          top: 0,
          zIndex: 9999,
        }}
        recycle={false}
        width={width}
        height={height}
        numberOfPieces={300}
      />

      <div
        style={{
          backgroundColor: "#9afcc5",
          color: "#7135C7",
          width: "144px",
          height: "144px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span>
          <span className="text-6xl font-medium font-display text-primary">
            {similarity.toFixed(0)}
          </span>
          <span className="text-4xl font-bold font-display text-primary">
            %
          </span>
        </span>
      </div>

      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <h4 className="mb-2 text-4xl font-display">Similarity</h4>
        <h5 className="text-2xl text-gray-500 font-display">
          with the original artwork. Amazing!
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

      <div className="flex gap-6">
        <SecondaryButton
          onClick={async () => {
            if (!walk) return;
            await fetch(`/api/challenges/${id}/walks/${walk.userAddr}`, {
              method: "PATCH",
              body: JSON.stringify({
                ...walk,
                updatedAt: new Date(),
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
                nftId: null,
                similarity: null,
              }),
            });
            queryClient.refetchQueries([
              "challenges",
              id,
              "walks",
              walk.userAddr,
            ]);
            queryClient.refetchQueries(["challenges", id]);
            router.push(`/challenges/${id}/walk`);
          }}
        >
          Restart
        </SecondaryButton>
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
            router.push(`/challenges/${id}/done`);
          }}
        >
          Submit
        </PrimaryButton>
      </div>
    </div>
  );
}
