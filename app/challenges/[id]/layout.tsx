import { PropsWithChildren } from "react";
import { ChallengeStateProvider } from "./ChallengeStateProvider";

export default function ChallengeLayout({ children }: PropsWithChildren) {
  return <ChallengeStateProvider>{children}</ChallengeStateProvider>;
}
