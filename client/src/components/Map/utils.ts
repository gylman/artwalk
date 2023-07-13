import type { CircleLayer, GeoJSONSource, LineLayer } from "mapbox-gl";
import type { RgbColor } from "react-colorful";
import type { Path, PathStyle } from "../../state";

export const DEFAULT_LONGITUDE = 126.986;
export const DEFAULT_LATITUDE = 37.541;
export const DEFAULT_ZOOM = 13;

function getLineWidthStops(lineWidth: number) {
  return [
    // [zoomLevel, lineWidth][]
    [0, 0.1 * lineWidth * Math.pow(2, 0 - DEFAULT_ZOOM)],
    [24, 0.1 * lineWidth * Math.pow(2, 24 - DEFAULT_ZOOM)],
  ];
}

function getCircleRadiusStops(lineWidth: number) {
  return getLineWidthStops(lineWidth * 0.5);
}

export function getPathPaint(style: PathStyle) {
  return {
    "line-color": rgbToHex(style.color),
    "line-width": {
      type: "exponential" as "exponential",
      base: 2,
      stops: getLineWidthStops(style.lineWidth),
    },
  };
}

export function getCirclePaint(style: PathStyle) {
  return {
    "circle-radius": getCircleRadius(style.lineWidth),
    "circle-color": rgbToHex(style.color),
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  };
}

export function getCircleRadius(lineWidth: number) {
  return {
    type: "exponential" as "exponential",
    base: 2,
    stops: getCircleRadiusStops(lineWidth),
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
    point = map.getSource("point") as GeoJSONSource;
  }

  let layer = map.getLayer("point-layer") as CircleLayer;
  if (layer) {
    map.removeLayer("point-layer");
  }
  map.addLayer({
    id: "point-layer",
    type: "circle",
    source: `point`,
    paint: getCirclePaint(style),
  });
  layer = map.getLayer("point-layer") as CircleLayer;

  return { point, layer };
}

export function setPathCoordinates(
  map: mapboxgl.Map,
  index: number,
  coordinates: Path[]
) {
  let path = map.getSource(`path-${index}`) as GeoJSONSource | undefined;
  if (!path) {
    throw new Error(`Path ${index} not found`);
  }

  path.setData({
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
    path = map.getSource(`path-${index}`) as GeoJSONSource;
  }

  let layer = map.getLayer(`path-layer-${index}`) as LineLayer;
  if (layer) {
    const paint = getPathPaint(style);
    for (const key in paint) {
      map.setPaintProperty(layer.id, key, paint[key]);
    }
  } else {
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
    layer = map.getLayer(`path-layer-${index}`) as LineLayer;
  }

  return { path, layer };
}

export function clearSources(map: mapboxgl.Map, from = 0) {
  let index = from;
  while (true) {
    let path = map.getSource(`path-${index}`);
    let layer = map.getLayer(`path-layer-${index}`);

    if (!path && !layer) return;
    if (path) {
      map.removeSource(`path-${index}`);
    }
    if (layer) {
      map.removeLayer(`path-layer-${index}`);
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
