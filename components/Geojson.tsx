"use client";

import type { WalkData } from "@/app/challenges/[id]/walk/Map/types";
import { walkDataToSvg } from "@/app/challenges/[id]/walk/Map/utils";
import { useMemo } from "react";
import Gloss from "./Gloss";

export function Geojson({ walkData }: { walkData: WalkData }) {
  const { svg, width, aspectRatio } = useMemo(
    () => walkDataToSvg(walkData),
    [walkData],
  );

  return (
    <Gloss className="border border-white rounded-lg overflow-clip bg-white/50 backdrop-blur-sm">
      <div
        style={{
          width,
          height: `calc(${width} / ${aspectRatio})`,
        }}
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
    </Gloss>
  );
}
