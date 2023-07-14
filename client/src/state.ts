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
