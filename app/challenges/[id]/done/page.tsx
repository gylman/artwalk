"use client";

import BackButton from "@/components/BackButton";
import { Geojson } from "@/components/Geojson";
import { Plane } from "@/components/Plane";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { TopBar } from "@/components/TopBar";
import { ChallengeType } from "@/lib/drizzle/schema";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useChallengeStateContext } from "../context";
import { WalkData } from "../walk/Map/types";

export default function Done({ params: { id } }: { params: { id: string } }) {
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

  const title = useMemo(() => {
    return challenge?.data.challenge.title;
  }, [challenge]);

  useEffect(() => {
    if (!title) return;
    const timeout = setTimeout(async () => {
      await fetch(`/api/challenges/${id}/close`, { method: "POST" });
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-1 ml-3">
                  <p className="text-sm font-medium text-primary font-display">
                    The challenge &#39;{title}&#39; has been finished!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    You wanna see the result?
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  router.push(`/challenges/${id}/results`);
                  toast.dismiss(t.id);
                }}
                className="flex items-center justify-center w-full p-4 text-sm font-medium border border-transparent rounded-none rounded-r-lg text-primary focus:outline-none focus:ring-2"
              >
                Sure!
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
        },
      );
    }, 5_000);
  }, [title, id, router]);

  return (
    <div className="relative flex flex-col items-stretch h-full">
      <TopBar backButton={<BackButton onClick={() => router.back()} />}>
        <h1 className="text-3xl text-primary font-display">
          Artwork Submitted
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
          <Plane />
        </div>

        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <h4 className="mb-2 text-4xl font-display">Wait for the deadline</h4>
          <h5 className="text-2xl text-gray-500 font-display">
            The top 3 will be able to mint an NFT.
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "24px 0",
          }}
        >
          <Link href="/profiles">
            <SecondaryButton>Go to your profile</SecondaryButton>
          </Link>
          <Link href="/challenges">
            <PrimaryButton>Browse new challenges</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
