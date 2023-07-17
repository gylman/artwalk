"use client";

import PrimaryButton from "@/components/PrimaryButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import * as fcl from "@onflow/fcl";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";

export default function Auth() {
  const user = useCurrentUser();

  return (
    <>
      {!user ? (
        <PrimaryButton disabled>
          <IconLoader2 className="animate-spin w-[99px]" />
        </PrimaryButton>
      ) : user.loggedIn ? (
        <Link href="/challenges">
          <PrimaryButton>Go to challenge</PrimaryButton>
        </Link>
      ) : (
        <PrimaryButton onClick={fcl.logIn}>Connect wallet</PrimaryButton>
      )}
    </>
  );
}
