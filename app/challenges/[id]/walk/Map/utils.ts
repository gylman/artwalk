import type { CircleLayer, GeoJSONSource, LineLayer } from "mapbox-gl";
import type { RgbColor } from "react-colorful";
import type { Datapoint, Path, PathStyle, WalkData } from "./types";

export function getDistance(p1: Datapoint, p2: Datapoint) {
  const LNG = 0;
  const LAT = 1;

  const R = 6371e3; // metres
  const φ1 = (p1.location[LAT] * Math.PI) / 180; // φ, λ in radians
  const φ2 = (p2.location[LAT] * Math.PI) / 180;
  const Δφ = ((p2.location[LAT] - p1.location[LAT]) * Math.PI) / 180;
  const Δλ = ((p2.location[LNG] - p2.location[LNG]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in metres
}

export function getPathPaint(style: PathStyle) {
  return {
    "line-color": rgbToHex(style.color),
    "line-width": style.lineWidth,
  };
}

export function getCirclePaint(style: PathStyle) {
  return {
    "circle-radius": style.lineWidth / 2,
    "circle-color": rgbToHex(style.color),
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  };
}

export function rgbToHex(rgb: RgbColor) {
  const r = rgb.r.toString(16).padStart(2, "0");
  const g = rgb.g.toString(16).padStart(2, "0");
  const b = rgb.b.toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

export function setCircle(
  map: mapboxgl.Map,
  coordinate: [lng: number, lat: number],
  style: PathStyle,
) {
  let point = map.getSource("point") as GeoJSONSource;
  if (point) {
    point.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: coordinate,
      },
    });
  } else {
    try {
      map.addSource("point", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: coordinate,
          },
        },
      });
    } catch {
      setTimeout(() => {
        try {
          map.addSource("point", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coordinate,
              },
            },
          });
        } catch {}
      }, 900);
    }
  }

  let layer = map.getLayer("point-layer") as CircleLayer;
  if (layer) {
    map.removeLayer("point-layer");
  }
  try {
    if (!map.getLayer("point-layer"))
      map.addLayer({
        id: "point-layer",
        type: "circle",
        source: "point",
        paint: getCirclePaint(style),
      });
  } catch {
    setTimeout(() => {
      try {
        if (!map.getLayer("point-layer"))
          map.addLayer({
            id: "point-layer",
            type: "circle",
            source: "point",
            paint: getCirclePaint(style),
          });
      } catch {}
    }, 1000);
  }
}

export function setPathCoordinates(
  map: mapboxgl.Map,
  index: number,
  coordinates: Path,
  style: PathStyle,
) {
  let path = map.getSource(`path-${index}`) as GeoJSONSource | undefined;
  if (!path) {
    createPath(map, index, coordinates.datapoints, style);
    path = map.getSource(`path-${index}`) as GeoJSONSource | undefined;
  }

  path?.setData({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: coordinates.datapoints.map(({ location }) => location),
    },
  });
}

export function createPath(
  map: mapboxgl.Map,
  index: number,
  coordinates: Datapoint[],
  style: PathStyle,
) {
  let path = map.getSource(`path-${index}`) as GeoJSONSource;
  if (path) {
    path.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordinates.map(({ location }) => location),
      },
    });
  } else {
    try {
      map.addSource(`path-${index}`, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates.map(({ location }) => location),
          },
        },
      });
    } catch {
      console.log(`failed to add source path-${index}`);
      setTimeout(() => {
        try {
          map.addSource(`path-${index}`, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coordinates.map(({ location }) => location),
              },
            },
          });
        } catch {
          console.log(`still failed to add source path-${index}`);
        }
      }, 900);
    }
  }

  let layer = map.getLayer(`path-layer-${index}`) as LineLayer;
  if (layer) {
    const paint = getPathPaint(style);
    for (const key in paint) {
      map.setPaintProperty(layer.id, key, paint[key as keyof typeof paint]);
    }
  } else {
    try {
      if (!map.getLayer(`path-layer-${index}`))
        map.addLayer({
          id: `path-layer-${index}`,
          type: "line",
          source: `path-${index}`,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: getPathPaint(style),
        });
    } catch {
      console.log("failed to addLayer point");
      setTimeout(() => {
        try {
          if (!map.getLayer(`path-layer-${index}`))
            map.addLayer({
              id: `path-layer-${index}`,
              type: "line",
              source: `path-${index}`,
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: getPathPaint(style),
            });
        } catch {
          console.log("still failed to addLayer point");
        }
      }, 1000);
    }
  }
}

export function clearSources(map: mapboxgl.Map, from = 0) {
  let index = from;
  while (true) {
    let path = map.getSource(`path-${index}`);
    let layer = map.getLayer(`path-layer-${index}`);

    if (!path && !layer) return;
    if (layer) {
      map.removeLayer(`path-layer-${index}`);
    }
    if (path) {
      map.removeSource(`path-${index}`);
    }
  }
}

export function isStyleSame(a: PathStyle, b: PathStyle) {
  return (
    a.lineWidth === b.lineWidth &&
    a.color.r === b.color.r &&
    a.color.g === b.color.g &&
    a.color.b === b.color.b
  );
}

const defaultTo = (num: number, defaultValue: number) =>
  Number.isFinite(num) ? num : defaultValue;

export function walkDataToSvg(walkData: WalkData) {
  const { minX, minY, maxX, maxY } = walkData.paths
    .flat()
    .flatMap(({ datapoints }) => datapoints)
    .reduce(
      (acc, { location: [lng, lat] }) => ({
        minX: Math.min(acc.minX, lng),
        maxX: Math.max(acc.maxX, lng),
        minY: Math.min(acc.minY, lat),
        maxY: Math.max(acc.maxY, lat),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    );

  const cosFactor = Math.cos(defaultTo(((minY + maxY) / 360) * Math.PI, 1));

  const scale = 360 / Math.max((maxX - minX) * cosFactor, maxY - minY);
  const padding = 36;

  const viewBox = `${-padding} ${-padding} ${defaultTo(
    (maxX - minX) * cosFactor * scale + padding * 2,
    24,
  )} ${defaultTo((maxY - minY) * scale + padding * 2, 24)}`;

  const aspectRatio = Math.max(
    1 / 2,
    Math.min(
      2,
      defaultTo(
        ((maxX - minX) * cosFactor + (2 * padding) / scale) /
          (maxY - minY + (2 * padding) / scale),
        1,
      ),
    ),
  );
  const width = `min(${Math.min(480, 480 * aspectRatio)}px, 100vw - 96px)`;

  return {
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" style="width:100%;height:100%">
      ${walkData.paths
        .filter(
          (path): path is Path & { styleIndex: number } =>
            path.styleIndex !== undefined,
        )
        .map(
          (path) =>
            `<path
          style="color:${rgbToHex(walkData.styles[path.styleIndex].color)}"
          d="M ${path.datapoints
            .map((_, index) => {
              const LNG = 0;
              const LAT = 1;

              let lng = 0;
              let lat = 0;
              let denom = 0;
              const isValid = (index: number) =>
                index >= 0 && index < path.datapoints.length;

              if (isValid(index - 2)) {
                denom += 1;
                lng += path.datapoints[index - 2].location[LNG];
                lat += path.datapoints[index - 2].location[LAT];
              }
              if (isValid(index - 1)) {
                denom += 2;
                lng += 2 * path.datapoints[index - 1].location[LNG];
                lat += 2 * path.datapoints[index - 1].location[LAT];
              }
              if (isValid(index)) {
                denom += 3;
                lng += 3 * path.datapoints[index].location[LNG];
                lat += 3 * path.datapoints[index].location[LAT];
              }
              if (isValid(index + 1)) {
                denom += 2;
                lng += 2 * path.datapoints[index + 1].location[LNG];
                lat += 2 * path.datapoints[index + 1].location[LAT];
              }
              if (isValid(index + 2)) {
                denom += 1;
                lng += path.datapoints[index + 2].location[LNG];
                lat += path.datapoints[index + 2].location[LAT];
              }

              return [lng / denom, lat/denom];
            })
            .map(
              ([lng, lat]) =>
                `${(lng - minX) * cosFactor * scale} ${(maxY - lat) * scale}`,
            )
            .join(" L ")}"
          stroke="currentColor"
          stroke-width="${walkData.styles[path.styleIndex].lineWidth * 1.5}"
          fill="transparent"
          stroke-linecap="round"
          stroke-linejoin="round"
        />`,
        )
        .join("")}
    </svg>
  `,
    aspectRatio,
    width,
  };
}
