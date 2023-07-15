import { useMemo } from "react";
import { StyledPathGroup } from "../state";
import Gloss from "./Gloss";
import { rgbToHex } from "./Map/utils";

const defaultTo = (num: number, defaultValue: number) =>
  Number.isFinite(num) ? num : defaultValue;

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

  const cosFactor = useMemo(
    () => Math.cos(defaultTo(((minY + maxY) / 180) * Math.PI, 1)),
    [minY, maxY]
  );

  const scale = 360 / Math.max((maxX - minX) * cosFactor, maxY - minY);
  const padding = 36;

  const viewBox = `${-padding} ${-padding} ${defaultTo(
    (maxX - minX) * cosFactor * scale + padding * 2,
    24
  )} ${defaultTo((maxY - minY) * scale + padding * 2, 24)}`;

  const aspectRatio = Math.max(
    1 / 2,
    Math.min(
      2,
      defaultTo(
        ((maxX - minX) * cosFactor + (2 * padding) / scale) /
          (maxY - minY + (2 * padding) / scale),
        1
      )
    )
  );
  const width = `min(${Math.min(480, 480 / aspectRatio)}px, 100vw - 96px)`;

  return (
    <Gloss
      style={{
        border: "1px solid white",
        borderRadius: "8px",
        overflow: "clip",
        backgroundColor: "#fff8",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          width,
          height: `calc(${width} / ${aspectRatio})`,
        }}
      >
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
                        `${(lng - minX) * cosFactor * scale} ${
                          (maxY - lat) * scale
                        }`
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
      </div>
    </Gloss>
  );
}
