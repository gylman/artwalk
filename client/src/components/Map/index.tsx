import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PaletteIcon from "@mui/icons-material/Palette";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import Slider from "@mui/material/Slider";
import { useAtom } from "jotai";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { RgbColorPicker } from "react-colorful";
import { env } from "../../env";
import {
  Path,
  PathStyle,
  StyledPathGroup,
  styledPathGroupsAtom,
} from "../../state";
import "./Map.css";
import { MapContext, useMapContext, useWatchPosition } from "./hooks";
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  DEFAULT_ZOOM,
  clearSources,
  createPath,
  isStyleSame,
  setCircle,
  setPathCoordinates,
} from "./utils";

mapboxgl.accessToken = env.VITE_MAPBOX_API_KEY;

const DEFAULT_STYLE = {
  lineWidth: 100,
  color: { r: 249, g: 115, b: 22 },
};

const PATH_SEPARATION_THRESHOLD = 0.003;

export function MapProvider({ children }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | undefined>(undefined);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [styledPathGroups, setStyledPathGroups] = useAtom(styledPathGroupsAtom);
  const [currentStyle, setCurrentStyle] = useState(
    styledPathGroups.at(-1)?.style ?? DEFAULT_STYLE
  );

  const clear = useCallback(() => {
    setStyledPathGroups(() => {
      if (map.current) clearSources(map.current);
      return [];
    });
  }, [setStyledPathGroups]);

  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!map.current) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <MapContext.Provider
      value={{
        map,
        mapContainer,
        isLoaded,
        setIsLoaded,
        isEnabled,
        setIsEnabled,
        styledPathGroups,
        setStyledPathGroups,
        clear,
        currentStyle,
        setCurrentStyle,
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

  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  const {
    map,
    mapContainer,
    isEnabled,
    setIsEnabled,
    isLoaded,
    setIsLoaded,
    currentStyle,
    setCurrentStyle,
    styledPathGroups,
    setStyledPathGroups,
  } = useMapContext();

  const [locationInitialized, setLocationInitialized] = useState(false);

  const addPoint = useCallback(
    (coordinate: [lng: number, lat: number]) => {
      setStyledPathGroups((styledPathGroups): StyledPathGroup[] => {
        if (!map.current) return styledPathGroups;

        const lastGroup = styledPathGroups.at(-1);
        if (!lastGroup) {
          createPath(map.current, 0, [coordinate], currentStyle);
          return [
            {
              style: currentStyle,
              paths: [[coordinate]],
            },
          ];
        }

        const lastStyle = lastGroup.style;
        const sameStyle = isStyleSame(lastStyle, currentStyle);

        setCircle(map.current, coordinate, currentStyle);

        if (sameStyle) {
          // append the coordinate to the last path
          const newLastGroupPaths = [
            ...lastGroup.paths.slice(0, -1),
            [...lastGroup.paths.at(-1)!, coordinate],
          ];
          setPathCoordinates(
            map.current,
            styledPathGroups.length - 1,
            newLastGroupPaths
          );

          return [
            ...styledPathGroups.slice(0, -1),
            {
              style: lastGroup.style,
              paths: newLastGroupPaths,
            },
          ];
        }

        const lastCoordinate = lastGroup.paths.at(-1)?.at(-1) ?? [
          DEFAULT_LONGITUDE,
          DEFAULT_LATITUDE,
        ];
        const path: Path = [lastCoordinate, coordinate];
        createPath(map.current, styledPathGroups.length, path, currentStyle);

        return [
          ...styledPathGroups,
          {
            style: currentStyle,
            paths: [path],
          },
        ];
      });
    },
    [setStyledPathGroups, currentStyle]
  );

  const watchPositionCallback = useCallback(
    ({ coords }) => {
      const lng = coords.longitude;
      const lat = coords.latitude;

      addPoint([lng, lat]);
      setLocationInitialized((locationInitialized) => {
        if (isFollowingRef.current && locationInitialized) {
          map.current?.easeTo({ center: [lng, lat] });
        } else if (isFollowingRef.current && map.current) {
          map.current.setCenter([lng, lat]);
          setCircle(map.current, [lng, lat], currentStyle);
        }
        return true;
      });
    },
    [addPoint, map, currentStyle, setLocationInitialized]
  );

  const watchPositionOnError = useCallback(
    (e: Error) => {
      console.error(e.message);
      setIsEnabled(false);
    },
    [setIsEnabled]
  );

  useWatchPosition({
    isEnabled: isLoaded && isEnabled,
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
      center: styledPathGroups.at(-1)?.paths.at(-1)?.at(-1) ?? [
        DEFAULT_LONGITUDE,
        DEFAULT_LATITUDE,
      ],
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
  }, []);

  useEffect(() => {
    map.current?.on("move", (e) => {
      // e.originalEvent exists only for user-caused move event
      if (!e.originalEvent) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    });
  }, [map]);

  useEffect(() => {
    if (!map.current) return;
    if (!isLoaded) return;

    const lastCoordinate = styledPathGroups.at(-1)?.paths.at(-1)?.at(-1) ?? [
      DEFAULT_LONGITUDE,
      DEFAULT_LATITUDE,
    ];
    setCircle(map.current, lastCoordinate, currentStyle);
  }, [currentStyle, isLoaded]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* toolbars */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "fixed",
          bottom: 88,
          right: 24,
        }}
      >
        {/* style customization */}
        <Fab
          size="medium"
          style={{
            backgroundColor: "white",
          }}
          color="secondary"
          aria-label="my-location"
          onClick={() => {
            setIsStyleModalOpen(true);
          }}
        >
          <PaletteIcon />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: `rgb(${currentStyle.color.r},${currentStyle.color.g},${currentStyle.color.b})`,
            }}
          />
        </Fab>
        <StyleModal
          isStyleModalOpen={isStyleModalOpen}
          setIsStyleModalOpen={setIsStyleModalOpen}
          currentStyle={currentStyle}
          setCurrentStyle={setCurrentStyle}
        />

        {/* following location */}
        <Fab
          size="medium"
          style={{
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
                center: styledPathGroups.at(-1)?.paths.at(-1)?.at(-1) ?? [
                  DEFAULT_LONGITUDE,
                  DEFAULT_LATITUDE,
                ],
              });
            }
          }}
        >
          {isFollowing ? <MyLocationIcon /> : <LocationSearchingIcon />}
        </Fab>
      </section>

      {!isLoaded && (
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

function StyleModal({
  isStyleModalOpen,
  setIsStyleModalOpen,
  currentStyle,
  setCurrentStyle,
}) {
  const [styleBuffer, setStyleBuffer] = useState<PathStyle>(currentStyle);

  useEffect(() => {
    setStyleBuffer(currentStyle);
  }, [currentStyle]);

  return (
    <Dialog
      onClose={() => setIsStyleModalOpen(false)}
      open={isStyleModalOpen}
      PaperProps={{
        style: {
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>Change path style</DialogTitle>

      <DialogContent style={{ overflowY: "visible" }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Color</h2>
        <RgbColorPicker
          color={styleBuffer.color}
          onChange={(color) => {
            setStyleBuffer((s) => ({ ...s, color }));
          }}
          style={{
            width: 256,
            height: 256,
          }}
        />

        <h2 style={{ fontSize: 16, margin: "16px 0 8px" }}>Line Width</h2>
        <div style={{ padding: "0 16px" }}>
          <Slider
            aria-label="line width"
            value={styleBuffer.lineWidth}
            valueLabelDisplay="auto"
            step={50}
            marks={[
              { value: 50, label: "50m" },
              { value: 500, label: "500m" },
            ]}
            min={50}
            max={500}
            onChange={(_, lineWidth) => {
              setStyleBuffer((s) => ({
                ...s,
                lineWidth: lineWidth as number,
              }));
            }}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            setCurrentStyle(styleBuffer);
            setIsStyleModalOpen(false);
          }}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
