import { useMemo } from "react";
import { StyledPathGroup } from "../state";
import { rgbToHex } from "./Map/utils";

export function Geojson({
  styledPathGroups,
}: {
  styledPathGroups: StyledPathGroup[];
}) {
  const { minX, minY, maxX, maxY } = useMemo(
    () =>
      styledPathGroups
        .map(({ paths }) => paths)
        .flat()
        .flat()
        .reduce(
          (acc, [lng, lat]) => ({
            minX: Math.min(acc.minX, lng),
            maxX: Math.max(acc.maxX, lng),
            minY: Math.min(acc.minY, lat),
            maxY: Math.max(acc.maxY, lat),
          }),
          { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
        ),
    [styledPathGroups]
  );

  const scale = 360 / Math.max(maxX - minX, maxY - minY);
  const padding = 24;

  const viewBox = `${-padding} ${-padding} ${
    (maxX - minX) * scale + padding * 2
  } ${(maxY - minY) * scale + padding * 2}`;
  return (
    <svg
      viewBox={viewBox}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {styledPathGroups.map((group, index) => (
        <g key={index} style={{ color: rgbToHex(group.style.color) }}>
          {group.paths.map((path, index) => (
            <path
              key={index}
              d={`M ${path
                .map(
                  ([lng, lat]) =>
                    `${(lng - minX) * scale} ${(maxY - lat) * scale}`
                )
                .join(" L ")}`}
              stroke="currentColor"
              strokeWidth={group.style.lineWidth * 1.5}
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
