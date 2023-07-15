import { atomWithStorage } from "jotai/utils";
import type { RgbColor } from "react-colorful";

export type PathStyle = {
  lineWidth: number; // approximately in meters
  color: RgbColor; // hex-string of the color
};
export type Path = [lng: number, lat: number][];
export interface StyledPathGroup {
  paths: Path[];
  style: PathStyle;
}

export const styledPathGroupsAtom = atomWithStorage<StyledPathGroup[]>(
  "styledPathGroups",
  JSON.parse(localStorage.getItem("styledPathGroups") ?? "[]")
);

export const currentChallengeAtom = atomWithStorage<string | null>(
  "currentChallenge",
  null
);

export type ChallengeState = {
  styledPathGroups: StyledPathGroup[];
  similarity: number;
  endAt: number;
  isSubmitted: boolean;
  isResultShown: boolean;
  isToastShown: boolean;
  isMinted: boolean;
};

export const challengeStatesAtom = atomWithStorage<
  Record<string, ChallengeState>
>("challengeStates", {});
