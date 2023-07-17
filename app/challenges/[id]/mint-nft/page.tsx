"use client";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { TopBar } from "@/components/TopBar";
import useCurrentUser from "@/hooks/useCurrentUser";
import type { ChallengeType, NFTType, WalkType } from "@/lib/drizzle/schema";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { WalkData } from "../walk/Map/types";

const MintNFTButton = dynamic(() => import("./MintNFTButton"), {
  ssr: false,
});

export default function MintNFT() {
  const { id } = useParams();
  const user = useCurrentUser();
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const { data } = useQuery({
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

  const { data: walks } = useQuery({
    queryKey: ["users", user?.addr, "walks"],
    queryFn: () =>
      !user?.addr
        ? undefined
        : fetch(`/api/users/${user.addr}/walks`).then(
            async (res) =>
              (await res.json()) as {
                status: "success";
                data: {
                  walks: WalkType;
                  challenges: ChallengeType;
                }[];
              },
          ),
    enabled: !!user?.addr,
  });

  const entry = useMemo(() => {
    return walks?.data.find(
      ({ challenges }) => challenges.id === parseInt(id as string, 10),
    );
  }, [walks, id]);
  const nftId = useMemo(() => {
    return nfts?.data.find(
      ({ challenges }) => challenges.id === parseInt(id as string, 10),
    )?.nfts.id;
  }, [nfts, id]);
  const walkData = entry?.walks.data;
  const walkId = entry?.walks.id;
  const userAddr = user?.addr;

  return (
    <div className="relative flex flex-col items-stretch h-full">
      <TopBar backButton={<BackButton onClick={() => router.back()} />}>
        <h1 className="text-3xl text-primary font-display">Mint Your NFT</h1>
      </TopBar>

      <form ref={form} className="flex flex-col items-stretch gap-6 p-6">
        <label className="w-full h-12 [&:focus-within>span]:text-primary">
          <span className="block h-4 font-sans text-xs text-gray-500 transition-colors duration-150">
            Author address
          </span>
          <input
            readOnly
            value={user?.addr ?? ""}
            className="w-full h-8 leading-8 transition-colors duration-150 bg-transparent border-b-2 border-gray-300 outline-none focus:border-primary font-display"
          />
        </label>

        <label className="w-full h-12 [&:focus-within>span]:text-primary">
          <span className="block h-4 font-sans text-xs text-gray-500 transition-colors duration-150">
            Title
          </span>
          <input
            name="title"
            placeholder={
              data?.data?.challenge.title
                ? `My ${data.data.challenge.title} walking`
                : ""
            }
            className="w-full h-8 leading-8 transition-colors duration-150 bg-transparent border-b-2 border-gray-300 outline-none focus:border-primary font-display"
          />
        </label>

        <label className="w-full h-12 [&:focus-within>span]:text-primary">
          <span className="block h-4 font-sans text-xs text-gray-500 transition-colors duration-150">
            Description
          </span>
          <input
            name="description"
            className="w-full h-8 leading-8 transition-colors duration-150 bg-transparent border-b-2 border-gray-300 outline-none focus:border-primary font-display"
          />
        </label>
      </form>

      <MintNFTButton
        form={form}
        nftId={entry?.challenges.type === "creative" ? "creative" : nftId}
        walkData={walkData as WalkData | undefined}
        walkId={walkId}
        userAddr={userAddr}
      />
    </div>
  );
}
