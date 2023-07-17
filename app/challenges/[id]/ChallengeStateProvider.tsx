"use client";

import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import TertiaryButton from "@/components/TertiaryButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ChallengeType, NFTType, WalkType } from "@/lib/drizzle/schema";
import { capitalize } from "@/utils/string";
import { IconLoader2 } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { ChallengeStateContext } from "./context";

export function ChallengeStateProvider({ children }: PropsWithChildren) {
  const { id } = useParams() as { id: string };
  const user = useCurrentUser();
  const [walk, setWalk] = useState<WalkType | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { isFetched, data, refetch } = useQuery({
    queryKey: ["challenges", id, "walks", user?.addr],
    queryFn: () =>
      !user?.addr
        ? undefined
        : fetch(`/api/challenges/${id}/walks/${user.addr}`).then(
            async (res) =>
              (await res.json()) as {
                status: "success";
                data: {
                  challenges: ChallengeType | null;
                  nfts: NFTType | null;
                  walks: WalkType | null;
                } | null;
              },
          ),
    enabled: !!user?.addr,
  });
  const start = useMutation(
    async () =>
      !user?.addr
        ? undefined
        : await fetch(`/api/challenges/${id}/walks/${user.addr}`, {
            method: "POST",
          }),
    {
      onSuccess: () => {
        refetch();
      },
    },
  );

  useEffect(() => {
    const newWalk = data?.data?.walks;
    if (
      newWalk &&
      (!walk ||
        new Date(walk.updatedAt).getTime() <
          new Date(newWalk.updatedAt).getTime())
    ) {
      setWalk(newWalk);
    }
  }, [data, walk]);

  return (
    <ChallengeStateContext.Provider value={{ walk, setWalk }}>
      {pathname.endsWith("/walk") && !data?.data?.walks && (
        <div className="absolute top-0 left-0 z-50 grid w-full h-full p-6 bg-gray-800/50 backdrop-blur place-items-center">
          {isFetched && data?.data?.challenges && (
            <div className="w-full max-w-sm max-h-full p-4 overflow-y-auto bg-white shadow-xl rounded-3xl">
              <section className="p-2">
                <h1 className="text-xl font-display">
                  You are about to start
                  <br />
                  <span className="text-3xl text-primary">
                    {data.data.challenges.title}
                  </span>
                </h1>
                <div className="grid grid-cols-[80px_1fr] grid-rows-2 leading-8 m-4">
                  {data.data.challenges.type === "competitive" ? (
                    <>
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-medium text-right text-gray-800">
                        {data.data.challenges.deadline &&
                          new Date(
                            data.data.challenges.deadline,
                          ).toLocaleString("en")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-600">Mode</span>
                      <span className="font-medium text-right text-gray-800">
                        Creative
                      </span>
                    </>
                  )}
                  <span className="text-gray-600">Pricing</span>
                  <span className="font-medium text-right text-gray-800">
                    {capitalize(data.data.challenges.pricing)}
                  </span>
                </div>
                {data.data.challenges.imageUrl && (
                  <img
                    alt={data.data.challenges.title}
                    src={data.data.challenges.imageUrl}
                    className="object-cover object-center w-full mb-4 shadow-md max-h-40 rounded-xl overflow-clip shadow-primary-900/25"
                  />
                )}
                <p className="my-6">
                  Wish you the best on your challenge! Watch out on the street
                  as well!
                </p>
              </section>
              <div className="flex justify-between">
                <TertiaryButton onClick={() => router.back()}>
                  Go back
                </TertiaryButton>
                <PrimaryButton
                  disabled={start.isLoading}
                  onClick={() => start.mutate()}
                >
                  {start.isLoading ? (
                    <IconLoader2 className="animate-spin" />
                  ) : (
                    "Start"
                  )}
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      )}
      {children}
    </ChallengeStateContext.Provider>
  );
}
