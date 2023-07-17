import { RgbColor } from "react-colorful";

export type PathStyle = {
  color: RgbColor;
  lineWidth: number;
};

export type Path = {
  styleIndex?: number;
  datapoints: Datapoint[];
};

export type Datapoint = {
  location: [lng: number, lat: number];
  timestamp: number;
};

export type WalkData = {
  styles: PathStyle[];
  paths: Path[];
  states: WalkDataStates;
};

export type WalkDataStates = {
  isPaused: boolean;
};
