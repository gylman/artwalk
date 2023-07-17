"use client";

import BackButton from "@/components/BackButton";
import { TopBar } from "@/components/TopBar";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ChallengeType, NFTType, WalkType } from "@/lib/drizzle/schema";
import { queryClient } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useChallengeStateContext } from "../context";
import Map from "./Map";

export default function Walk({ params: { id } }: { params: { id: string } }) {
  const user = useCurrentUser();
  const router = useRouter();

  const { walk } = useChallengeStateContext();
  const walkRef = useRef(walk);
  useEffect(() => {
    walkRef.current = walk;
  }, [walk]);

  useEffect(() => {
    if (!user?.addr || !walkRef.current) return;
    console.log("sync refreshed");
    const PERIOD = 10_000;
    const interval = setInterval(() => {
      console.log("mutate?");
      fetch(`/api/challenges/${id}/walks/${user.addr}`, {
        method: "PATCH",
        body: JSON.stringify(walkRef.current),
      });
      queryClient.refetchQueries(["challenges", id, "walks", user?.addr]);
      queryClient.refetchQueries(["challenges", id]);
    }, PERIOD);
    return () => clearInterval(interval);
  }, [user?.addr, id]);

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
      <div className="absolute top-0 z-10 w-full">
        <TopBar
          backButton={<BackButton onClick={() => router.push("/challenges")} />}
        >
          <img
            src={challenge?.data.challenge.imageUrl ?? undefined}
            className="absolute h-40 rounded-lg shadow-lg top-2 right-2"
          />
        </TopBar>
      </div>
      <Map className="relative flex-1 min-h-0" />
    </div>
  );
}
