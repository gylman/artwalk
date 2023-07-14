import { LocationSearching, MyLocation, Palette } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Portal,
  Slider,
  Typography,
} from "@mui/material";
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
  lineWidth: 10,
  color: { r: 113, g: 53, b: 199 },
};

export function MapProvider({ children }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | undefined>(undefined);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [styledPathGroups, setStyledPathGroups] = useAtom(styledPathGroupsAtom);
  const [currentStyle, setCurrentStyle] = useState(
    // XXX: for some unknown reason `styledPathGroups` is not initialized by the value from localStorage
    JSON.parse(localStorage.getItem("styledPathGroups") ?? "[]").at(-1)
      ?.style ?? DEFAULT_STYLE
  );

  const clear = useCallback(() => {
    setStyledPathGroups(() => {
      if (map.current) clearSources(map.current);
      return [];
    });
  }, [setStyledPathGroups]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!map.current) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const continueWalk = useCallback(() => {
    setStyledPathGroups((p) => [
      ...p,
      {
        style: currentStyle,
        paths: [[]],
      },
    ]);
    setIsEnabled(true);
  }, [currentStyle]);

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
        continueWalk,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function Map() {
  const [lastError, setLastError] = useState("");
  const [lastAccuracy, setLastAccuracy] = useState(-1);

  const [isFollowing, setIsFollowing] = useState(true);
  const isFollowingRef = useRef(false);
  useEffect(() => {
    isFollowingRef.current = isFollowing;
  }, [isFollowing]);

  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);

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

  // draw all when first loaded
  useEffect(() => {
    if (isEnabled && isLoaded) {
      styledPathGroups.forEach((group, index) => {
        if (map.current) {
          setPathCoordinates(map.current, index, group.paths, group.style);
        }
      });
    }
  }, [isEnabled, isLoaded]);

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

        if (sameStyle) {
          // append the coordinate to the last path
          const newLastGroupPaths = [
            ...lastGroup.paths.slice(0, -1),
            [...lastGroup.paths.at(-1)!, coordinate],
          ];
          setPathCoordinates(
            map.current,
            styledPathGroups.length - 1,
            newLastGroupPaths,
            lastStyle
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
      setLastAccuracy(coords.accuracy);
      setLastError("");

      if (map.current) {
        setCircle(map.current, [lng, lat], currentStyle);
      }

      if (isEnabled) {
        addPoint([lng, lat]);
      }

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
    [addPoint, map, currentStyle, setLocationInitialized, isEnabled]
  );

  const watchPositionOnError = useCallback(
    (e: Error) => {
      console.error(e.message);
      setLastError(e.message);
      if (!e.message.includes("timed")) {
        setIsEnabled(false);
      }
    },
    [setIsEnabled]
  );

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
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        {/* style customization */}
        <Fab
          size="medium"
          sx={{
            color: "#7135C7",
            backgroundColor: "#F6F4F8",
            borderRadius: "30%",
            ":hover": {
              backgroundColor: "rgb(226,230,220)",
            },
          }}
          color="secondary"
          aria-label="my-location"
          onClick={() => {
            setIsStyleDialogOpen(true);
          }}
        >
          <Palette />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: `rgb(${currentStyle.color.r},${currentStyle.color.g},${currentStyle.color.b})`,
            }}
          />
        </Fab>
        <StyleDialog
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
          currentStyle={currentStyle}
          setCurrentStyle={setCurrentStyle}
        />

        {/* following location */}
        <Fab
          size="medium"
          sx={{
            color: "#7135C7",
            backgroundColor: "#F6F4F8",
            borderRadius: "30%",
            ":hover": {
              backgroundColor: "rgb(226,230,220)",
            },
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
          {isFollowing ? <MyLocation /> : <LocationSearching />}
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

      {lastAccuracy >= 0 && (
        <Portal>
          <div
            style={{
              position: "fixed",
              top: 48,
              right: 0,
              backgroundColor: "#12f2",
              color: "black",
              zIndex: 9999,
              padding: 16,
            }}
          >
            <Typography variant="h6" fontFamily="Mona Sans">
              Accuracy: {lastAccuracy} m
            </Typography>
          </div>
        </Portal>
      )}
      {lastError && (
        <Portal>
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              backgroundColor: "#f122",
              color: "black",
              zIndex: 9999,
              padding: 16,
            }}
          >
            <Typography variant="h6" fontFamily="Mona Sans">
              {lastError}
            </Typography>
          </div>
        </Portal>
      )}
    </div>
  );
}

function StyleDialog({
  isStyleDialogOpen,
  setIsStyleDialogOpen,
  currentStyle,
  setCurrentStyle,
}) {
  const [styleBuffer, setStyleBuffer] = useState<PathStyle>(currentStyle);

  useEffect(() => {
    if (isStyleDialogOpen) {
      setStyleBuffer(currentStyle);
    }
  }, [currentStyle, isStyleDialogOpen]);

  return (
    <Dialog
      onClose={() => setIsStyleDialogOpen(false)}
      open={isStyleDialogOpen}
      PaperProps={{
        style: {
          overflow: "hidden",
          backgroundColor: "#F6F4F8",
          padding: "24px",
          borderRadius: "24px",
        },
      }}
    >
      <DialogTitle variant="h5" fontFamily="'Mona Sans'" sx={{ padding: 0 }}>
        Change path style
      </DialogTitle>

      <DialogContent sx={{ overflowY: "visible", paddingX: 0 }}>
        <Typography
          variant="h6"
          fontFamily="'Mona Sans'"
          sx={{ paddingTop: "16px", paddingBottom: "12px" }}
        >
          Color
        </Typography>
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

        <Typography
          variant="h6"
          fontFamily="'Mona Sans'"
          sx={{ paddingTop: "16px", paddingBottom: "12px" }}
        >
          Line Width
        </Typography>
        <div style={{ padding: "0 16px" }}>
          <Slider
            aria-label="line width"
            value={styleBuffer.lineWidth}
            valueLabelDisplay="auto"
            step={1}
            marks={[
              { value: 1, label: "1" },
              { value: 20, label: "20" },
            ]}
            min={1}
            max={20}
            onChange={(_, lineWidth) => {
              setStyleBuffer((s) => ({
                ...s,
                lineWidth: lineWidth as number,
              }));
            }}
          />
        </div>
      </DialogContent>

      <DialogActions sx={{ padding: 0 }}>
        <Button
          autoFocus
          onClick={() => {
            setCurrentStyle(styleBuffer);
            setIsStyleDialogOpen(false);
          }}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
