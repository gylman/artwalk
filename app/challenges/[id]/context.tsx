import { WalkType } from "@/lib/drizzle/schema";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface ChallengeStateContext {
  walk: WalkType | null;
  setWalk: Dispatch<SetStateAction<WalkType | null>>;
}
export const ChallengeStateContext = createContext<ChallengeStateContext>(
  undefined!,
);

export function useChallengeStateContext() {
  return useContext(ChallengeStateContext);
}
