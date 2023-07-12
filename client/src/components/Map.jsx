import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import { useAtom } from "jotai";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { env } from "../env";
import { pathAtom } from "../state";
import "./Map.css";

mapboxgl.accessToken = env.VITE_MAPBOX_API_KEY;

const timeout = 2000;
const fallbackTimeout = 5000;
const DEFAULT_LONGITUDE = 126.986;
const DEFAULT_LATITUDE = 37.541;

const DEFAULT_ZOOM = 13;
const lineWidthStops = [
  // [zoomLevel, lineWidth][]
  [0, 2],
  [5, 7],
  [12, 10],
  [15, 13],
  [24, 32],
];

const EPSILON = 1e-4;
const PATH_SEPARATION_THRESHOLD = 0.003;

const MapContext = createContext();

export function useMapContext() {
  const value = useContext(MapContext);
  if (!value) {
    throw new Error("useMapContext should be used inside <MapRoot />");
  }
  return value;
}

function useWatchPosition({ callback, onError, period = 10_000 }) {
  const onErrorWithFallback = useCallback(() => {
    navigator.geolocation.getCurrentPosition(callback, onError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: fallbackTimeout,
    });
  }, [callback, onError]);

  useEffect(() => {
    if (!navigator.geolocation) {
      onError(
        new Error("navigator.geolocation is not supported on this browser."),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      callback,
      onErrorWithFallback,
      { enableHighAccuracy: true, maximumAge: 10000, timeout },
    );

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        callback,
        onErrorWithFallback,
        { enableHighAccuracy: true, maximumAge: 10000, timeout },
      );
    }, period);

    return () => {
      clearInterval(interval);
    };
  }, [callback, onError, onErrorWithFallback, period]);
}

export function MapProvider({ children }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [paths, setPaths] = useAtom(pathAtom);
  const addPoint = useCallback((lng, lat) => {
    setPaths((paths) => {
      const lastPoint = paths.at(-1)?.at(-1);
      if (!lastPoint) {
        // XXX: EPSILON added to prevent degenerated lines
        return [[[lng + EPSILON, lat], [lng, lat]]];
      }

      const distance = Math.hypot(lastPoint[0] - lng, lastPoint[1] - lat);
      if (distance < PATH_SEPARATION_THRESHOLD) {
        return [...paths.slice(0, -1), [
          ...paths.at(-1),
          [lng, lat],
        ]];
      } else {
        // XXX: EPSILON added to prevent degenerated lines
        return [...paths, [[lng + EPSILON, lat], [lng, lat]]];
      }
    });
  }, [setPaths]);
  const resetPaths = useCallback(() => {
    setPaths([]);
  }, [setPaths]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!map.current) return;

    setTimeout(() => {
      map.current.addSource("path", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "MultiLineString",
            coordinates: paths,
          },
        },
      });
      map.current.addLayer({
        id: "path",
        type: "line",
        source: "path",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#f97316",
          "line-width": {
            type: "exponential",
            base: 2,
            stops: lineWidthStops,
          },
        },
      });
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Repaint the path whenever path changes
  useEffect(() => {
    if (!map.current) return;
    if (!isLoaded) return;

    map.current.getSource("path")?.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiLineString",
        coordinates: paths,
      },
    });
  }, [isLoaded, paths]);

  return (
    <MapContext.Provider
      value={{
        map,
        mapContainer,
        isLoaded,
        setIsLoaded,
        paths,
        addPoint,
        resetPaths,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function Map() {
  const [isFollowing, setIsFollowing] = useState(true);
  const isFollowingRef = useRef(false);
  useEffect(() => {
    isFollowingRef.current = isFollowing;
  }, [isFollowing]);

  const {
    map,
    mapContainer,
    isLoaded,
    setIsLoaded,
    paths,
    addPoint,
    resetPaths,
  } = useMapContext();

  const watchPositionCallback = useCallback(({ coords }) => {
    const lng = coords.longitude;
    const lat = coords.latitude;

    addPoint(lng, lat);
    if (isFollowingRef.current) {
      map.current?.easeTo({ center: [lng, lat] });
    }
  }, [addPoint, map]);

  const watchPositionOnError = useCallback((e) => {
    console.error(e);
  }, []);

  useWatchPosition({
    callback: watchPositionCallback,
    onError: watchPositionOnError,
  });

  // Initialize the Mapbox object
  useEffect(() => {
    if (map.current) return;

    const container = mapContainer.current;
    if (!container) return;

    map.current = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/light-v11",
      center: [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
      zoom: DEFAULT_ZOOM,
    });

    map.current.once("load", () => {
      setIsLoaded(true);
    });

    return () => {
      map.current = undefined;
      setIsLoaded(false);
      container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    map.current.on("move", (e) => {
      // e.originalEvent exists only for user-caused move event
      if (!e.originalEvent) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    });
  }, [map]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
        ref={mapContainer}
      />
      <Fab
        size="medium"
        style={{
          position: "fixed",
          bottom: 88,
          right: 24,
          backgroundColor: "white",
        }}
        color="secondary"
        aria-label="my-location"
        onClick={() => {
          if (!map.current) return;
          if (isFollowing) {
            setIsFollowing(false);
          } else {
            setIsFollowing(true);
            map.current.easeTo({
              center: paths.at(-1)?.at(-1) ??
                [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
            });
          }
        }}
      >
        {isFollowing ? <MyLocationIcon /> : <LocationSearchingIcon />}
      </Fab>
      {!isLoaded &&
        (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              backgroundColor: "#fff3",
              backdropFilter: "blur(4px)",
            }}
          >
            <CircularProgress
              style={{
                position: "absolute",
                top: "calc(50% - 20px)",
                left: "calc(50% - 20px)",
              }}
            />
          </div>
        )}
    </div>
  );
}
