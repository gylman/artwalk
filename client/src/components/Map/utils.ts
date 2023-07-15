import type { CircleLayer, GeoJSONSource, LineLayer } from "mapbox-gl";
import type { RgbColor } from "react-colorful";
import type { Path, PathStyle, StyledPathGroup } from "../../state";

export const DEFAULT_LONGITUDE = 126.986;
export const DEFAULT_LATITUDE = 37.541;
export const DEFAULT_ZOOM = 19;

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
  style: PathStyle
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
      console.log("failed to addSource point");
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
        } catch {
          console.log("still failed to addSource point");
        }
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
    console.log("failed to addLayer point");
    setTimeout(() => {
      try {
        if (!map.getLayer("point-layer"))
          map.addLayer({
            id: "point-layer",
            type: "circle",
            source: "point",
            paint: getCirclePaint(style),
          });
      } catch {
        console.log("still failed to addLayer point");
      }
    }, 1000);
  }
}

export function setPathCoordinates(
  map: mapboxgl.Map,
  index: number,
  coordinates: Path[],
  style: PathStyle
) {
  let path = map.getSource(`path-${index}`) as GeoJSONSource | undefined;
  if (!path) {
    createPath(map, index, coordinates[0], style);
    path = map.getSource(`path-${index}`) as GeoJSONSource | undefined;
  }

  path?.setData({
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiLineString",
      coordinates,
    },
  });
}

export function createPath(
  map: mapboxgl.Map,
  index: number,
  coordinates: Path,
  style: PathStyle
) {
  let path = map.getSource(`path-${index}`) as GeoJSONSource;
  if (path) {
    path.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiLineString",
        coordinates: [coordinates],
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
            type: "MultiLineString",
            coordinates: [coordinates],
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
                type: "MultiLineString",
                coordinates: [coordinates],
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
      map.setPaintProperty(layer.id, key, paint[key]);
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

export function getTotalDistance(groups: StyledPathGroup[]) {
  return groups
    .map((group) => group.paths)
    .flat()
    .map((path) =>
      path.map((p1, i) => {
        if (i === 0) return 0;

        const LNG = 0;
        const LAT = 1;
        const p2 = path[i - 1];

        const R = 6371e3; // metres
        const φ1 = (p1[LAT] * Math.PI) / 180; // φ, λ in radians
        const φ2 = (p2[LAT] * Math.PI) / 180;
        const Δφ = ((p2[LAT] - p1[LAT]) * Math.PI) / 180;
        const Δλ = ((p2[LNG] - p2[LNG]) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // in metres
      })
    )
    .flat()
    .reduce((a, b) => a + b, 0);
}
