"use client";

import PrimaryButton from "@/components/PrimaryButton";
import * as fcl from "@onflow/fcl";
import { MINT_ARTWALK } from "./mint.tx";
import "@/lib/fcl/config";
import { IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { RefObject, useState } from "react";
import { WalkData } from "../walk/Map/types";

export default function MintNFTButton({
  form,
  nftId,
  walkData,
  userAddr,
  walkId,
}: {
  form: RefObject<HTMLFormElement>;
  nftId?: number | "creative";
  walkData?: WalkData;
  userAddr?: string;
  walkId?: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <PrimaryButton
      disabled={nftId === undefined || loading}
      onClick={async () => {
        if (
          userAddr === undefined ||
          walkId === undefined ||
          nftId === undefined
        )
          return;
        if (!form.current) return;
        if (!walkData) return;
        const formData = new FormData(form.current);
        const title =
          formData.get("title") ||
          form.current.querySelector('input[name="title"]');
        const description = formData.get("description") || "";

        const executeTransaction = async () => {
          const transactionId = await fcl
            .mutate({
              cadence: MINT_ARTWALK,
              args: (arg, t) => [
                arg(JSON.stringify(walkData), t.String),
                arg(`${title}\n\n${description}`, t.String),
              ],
              payer: fcl.authz,
              proposer: fcl.authz,
              authorizations: [fcl.authz],
              limit: 50,
            } as Parameters<typeof fcl.mutate>[0])
            .catch((e) => {
              console.error("txerror", e);
              throw e;
            });

          return new Promise<void>((resolve) => {
            fcl.tx(transactionId).subscribe((res) => {
              if (res.status === 4) {
                resolve();
              }
            });
          });
        };

        try {
          setLoading(true);
          await executeTransaction();

          if (nftId !== "creative") {
            await fetch(`/api/nfts/${nftId}/claim`, {
              method: "POST",
            });
          } else {
            await fetch(`/api/nfts/mint`, {
              method: "POST",
              body: JSON.stringify({
                userAddr,
                walkId,
              }),
            });
          }
          router.push("/profiles");
        } catch (e) {
          console.error(e);
        }
      }}
      className="absolute -translate-x-1/2 bottom-12 left-1/2"
    >
      {loading ? <IconLoader2 className="animate-spin" /> : "Mint NFT"}
    </PrimaryButton>
  );
}
