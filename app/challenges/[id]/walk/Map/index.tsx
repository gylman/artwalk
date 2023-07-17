import { env } from "@/env";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import BaseDialog from "@/components/BaseDialog";
import Fab from "@/components/Fab";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import type { WalkType } from "@/lib/drizzle/schema";
import { queryClient } from "@/lib/query";
import * as Slider from "@radix-ui/react-slider";
import {
  IconLoader2,
  IconLocation,
  IconLocationFilled,
  IconPalette,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RgbColorPicker } from "react-colorful";
import { useChallengeStateContext } from "../../context";
import { useWatchPosition } from "./hooks";
import type { Datapoint, PathStyle, WalkData } from "./types";
import {
  clearSources,
  getDistance,
  isStyleSame,
  setCircle,
  setPathCoordinates,
} from "./utils";

mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_API_KEY;
const DEFAULT_LONGITUDE = 126.986;
const DEFAULT_LATITUDE = 37.541;
const DEFAULT_ZOOM = 19;
const DEFAULT_STYLE = {
  lineWidth: 10,
  color: { r: 113, g: 53, b: 199 },
};

export default function Map(props: HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();

  const { walk, setWalk } = useChallengeStateContext();
  const walkData = walk?.data as WalkData | undefined;
  const isPaused = !walkData || walkData.states.isPaused;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLocationSet = useRef(false);

  const [isFollowing, setIsFollowing] = useState(true);
  const isFollowingRef = useRef(isFollowing);
  useEffect(() => {
    isFollowingRef.current = isFollowing;
  }, [isFollowing]);
  useEffect(() => {
    map.current?.on("move", (e) => {
      // e.originalEvent exists only for user-caused move event
      setIsFollowing(!e.originalEvent);
    });
  }, [map, isLoaded]);

  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);

  const currentStyle = useMemo(
    () => (walk?.data as WalkData | undefined)?.styles.at(-1) ?? DEFAULT_STYLE,
    [walk],
  );
  const setCurrentStyle = useCallback(
    (style: PathStyle) => {
      setWalk((walk) =>
        !walk
          ? walk
          : produce(walk, (walk) => {
              const walkData = walk.data as WalkData;
              walkData.styles.push(style);
              const lastDatapoint = walkData.paths.at(-1)?.datapoints.at(-1);
              if (!walkData.states.isPaused && lastDatapoint) {
                walkData.paths.push({
                  styleIndex: (walk.data as WalkData).styles.length - 1,
                  datapoints: [lastDatapoint],
                });
              }
            }),
      );
    },
    [setWalk],
  );

  const [accuracy, setAccuracy] = useState(-1);
  const [error, setError] = useState("");

  const addPoint = useCallback(
    (datapoint: Datapoint) => {
      setWalk(
        (walk: WalkType | null) =>
          (!walk
            ? walk
            : produce(walk, (walk) => {
                walk.updatedAt = new Date();

                let lastPath = (walk.data as WalkData).paths.at(-1);
                let lastDatapoint: Datapoint | undefined;
                if (!lastPath) {
                  if (
                    (walk.data as WalkData).styles.length === 0 &&
                    !isPaused
                  ) {
                    (walk.data as WalkData).styles.push(currentStyle);
                  }
                  (walk.data as WalkData).paths.push({
                    styleIndex: isPaused
                      ? undefined
                      : (walk.data as WalkData).styles.length - 1,
                    datapoints: [datapoint],
                  });
                } else {
                  lastDatapoint = lastPath.datapoints.at(-1);
                  lastPath.datapoints.push(datapoint);
                }

                const distance = getDistance(
                  lastDatapoint ?? datapoint,
                  datapoint,
                );
                walk.totalLength += distance;
                walk.drawnLength += isPaused ? 0 : distance;

                const timeGap =
                  (datapoint.timestamp -
                    (lastDatapoint ?? datapoint).timestamp) /
                  60_000; // ms to minutes
                walk.totalTime += timeGap;
                walk.drawnTime += isPaused ? 0 : timeGap;
              })) as WalkType | null,
      );
    },
    [currentStyle, setWalk, isPaused],
  );

  const toggleIsPaused = useCallback(() => {
    setWalk((walk) =>
      !walk
        ? walk
        : produce(walk, (walk) => {
            walk.updatedAt = new Date();

            const walkData = walk.data as WalkData;
            const isPaused = walkData.states.isPaused;
            walkData.states.isPaused = !isPaused;

            if (
              isPaused &&
              (!walkData.styles.at(-1) ||
                !isStyleSame(walkData.styles.at(-1)!, currentStyle))
            ) {
              walkData.styles.push(currentStyle);
            }

            const lastDatapoint = walkData.paths.at(-1)?.datapoints.at(-1);
            if (!lastDatapoint) return;

            walkData.paths.push({
              styleIndex: !isPaused
                ? undefined
                : (walk.data as WalkData).styles.length - 1,
              datapoints: [lastDatapoint],
            });
          }),
    );
  }, [currentStyle, setWalk]);

  const clear = useCallback(() => {
    setWalk((walk) => {
      if (!walk) return walk;
      if (map.current) clearSources(map.current);
      return {
        ...walk!,
        updatedAt: new Date(),
        status: "in progress",
        data: {
          styles: [],
          paths: [],
          states: {
            isPaused: false,
          },
        },
        totalLength: 0,
        drawnLength: 0,
        totalTime: 0,
        drawnTime: 0,
      };
    });
  }, [setWalk]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!map.current) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCircle(
          map.current!,
          [coords.longitude, coords.latitude],
          currentStyle,
        );
      },
      undefined,
      {
        enableHighAccuracy: true,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // initialize mapbox
  useEffect(() => {
    if (map.current) return;

    const container = mapContainer.current;
    if (!container) return;

    map.current = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/light-v11",
      center: [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
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

  // watch position
  const watchPositionCallback = useCallback(
    ({ coords, timestamp }: GeolocationPosition) => {
      const lng = coords.longitude;
      const lat = coords.latitude;
      setAccuracy(coords.accuracy);
      setError("");

      if (map.current && isLoaded) {
        setCircle(map.current, [lng, lat], currentStyle);
      }

      addPoint({
        location: [lng, lat],
        timestamp,
      });

      if (isFollowingRef.current && isLocationSet.current && isLoaded) {
        map.current?.easeTo({ center: [lng, lat] });
      } else if (isFollowingRef.current && map.current && isLoaded) {
        map.current.setCenter([lng, lat]);
        setCircle(map.current, [lng, lat], currentStyle);
        isLocationSet.current = true;
      }
    },
    [currentStyle, addPoint, isLoaded],
  );
  useWatchPosition({ callback: watchPositionCallback });

  // draw all when first loaded
  useEffect(() => {
    walkData?.paths.forEach((path, index) => {
      if (map.current && path.styleIndex !== undefined) {
        setPathCoordinates(
          map.current,
          index,
          path,
          walkData.styles[path.styleIndex] ?? DEFAULT_STYLE,
        );
      }
    });
  }, [walkData]);

  const finish = useMutation(
    async () =>
      !walk
        ? undefined
        : await fetch(
            `/api/challenges/${walk.challengeId}/walks/${walk.userAddr}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                ...walk,
                status: "finished",
              }),
            },
          ),
    {
      onSuccess: () => {
        queryClient.refetchQueries([
          "challenges",
          walk?.challengeId,
          "walks",
          walk?.userAddr,
        ]);
        queryClient.refetchQueries(["challenges", walk?.challengeId]);
        router.push(`/challenges/${walk!.challengeId}/finish`);
      },
    },
  );

  return (
    <>
      <div {...props} className={`w-full h-full ${props.className}`}>
        {accuracy >= 0 && (
          <span className="absolute bottom-0 right-0 z-10 px-2 text-gray-500 pointer-events-none select-none">
            Accuracy: {accuracy.toFixed(2)} m
          </span>
        )}
        {error && (
          <span className="absolute right-0 z-10 px-2 text-red-500 pointer-events-none select-none bottom-8">
            Error: {error}
          </span>
        )}
        <div ref={mapContainer} className="w-full h-full" />

        <StyleDialog
          isStyleDialogOpen={isStyleDialogOpen}
          setIsStyleDialogOpen={setIsStyleDialogOpen}
          currentStyle={currentStyle}
          setCurrentStyle={setCurrentStyle}
        />

        <Fab
          onClick={() => {
            if (!map.current) return;
            if (isFollowing) {
              setIsFollowing(false);
            } else {
              setIsFollowing(true);
              const lastDatapoint = walkData?.paths.at(-1)?.datapoints.at(-1);
              if (lastDatapoint) {
                map.current.easeTo({
                  center: lastDatapoint.location,
                });
              }
            }
          }}
          className="absolute flex items-center justify-center bottom-6 right-6"
        >
          {isFollowing ? <IconLocationFilled /> : <IconLocation />}
        </Fab>
      </div>
      <div className="px-8 pt-4 leading-6 text-center font-display">
        {walk && (
          <>
            {" "}
            You have walked{" "}
            <span className="font-semibold text-primary whitespace-nowrap">
              {walk.drawnLength.toFixed(0)} meters
            </span>{" "}
            <span className="text-sm text-gray-500 whitespace-nowrap">
              (+
              {(walk.totalLength - walk.drawnLength).toFixed(0)} m)
            </span>{" "}
            for{" "}
            <span className="font-semibold text-primary whitespace-nowrap">
              {walk.drawnTime.toFixed(0)} minutes!
            </span>{" "}
            <span className="text-sm text-gray-500 whitespace-nowrap">
              (+
              {(walk.totalTime - walk.drawnTime).toFixed(0)} min)
            </span>
          </>
        )}
      </div>
      <div className="flex items-center justify-between h-20 px-5 pb-2">
        <SecondaryButton
          warn
          className="!px-4 !h-10"
          onClick={() => {
            if (confirm("Are you sure to clear your walking?")) {
              clear();
            }
          }}
        >
          Clear
        </SecondaryButton>
        <SecondaryButton
          className="!px-4 !h-10"
          onClick={() => toggleIsPaused()}
        >
          {(walk?.data as WalkData | undefined)?.states.isPaused
            ? "Continue"
            : "Pause"}
        </SecondaryButton>
        <PrimaryButton
          disabled={finish.isLoading || finish.isSuccess}
          onClick={() => {
            finish.mutate();
          }}
          className="!px-4 !h-10"
        >
          {finish.isLoading || finish.isSuccess ? (
            <IconLoader2 className="animate-spin" />
          ) : (
            "Finish"
          )}
        </PrimaryButton>
      </div>
    </>
  );
}

function StyleDialog({
  isStyleDialogOpen,
  setIsStyleDialogOpen,
  currentStyle,
  setCurrentStyle,
}: {
  isStyleDialogOpen: boolean;
  setIsStyleDialogOpen: Dispatch<SetStateAction<boolean>>;
  currentStyle: PathStyle;
  setCurrentStyle(style: PathStyle): void;
}) {
  const [styleBuffer, setStyleBuffer] = useState<PathStyle>(currentStyle);

  useEffect(() => {
    if (isStyleDialogOpen) {
      setStyleBuffer(currentStyle);
    }
  }, [currentStyle, isStyleDialogOpen]);

  return (
    <BaseDialog
      open={isStyleDialogOpen}
      setOpen={setIsStyleDialogOpen}
      title="Change Path Style"
      className="flex flex-col items-center"
      trigger={
        <Fab
          onClick={() => setIsStyleDialogOpen(true)}
          className="absolute bottom-[5.5rem] right-6 flex items-center justify-center"
        >
          <IconPalette />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: `rgb(${currentStyle.color.r},${currentStyle.color.g},${currentStyle.color.b})`,
            }}
          />
        </Fab>
      }
    >
      <h6 className="w-full mt-4 mb-2 text-lg font-medium font-display">
        Color
      </h6>
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
      <h6 className="w-full mt-4 mb-2 text-lg font-medium font-display">
        Line Width
      </h6>
      <div className="w-full px-4 mb-8">
        <div className="flex items-center w-full gap-4">
          <Slider.Root
            className="relative flex items-center flex-1 h-5 min-w-0 select-none touch-none"
            value={[styleBuffer.lineWidth]}
            max={30}
            step={1}
            min={1}
            onValueChange={([lineWidth]) => {
              setStyleBuffer((s) => ({
                ...s,
                lineWidth,
              }));
            }}
          >
            <Slider.Track className="bg-gray-600 relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute h-full rounded-full bg-primary-400" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 rounded-full shadow-md bg-primary shadow-primary-900/50"
              aria-label="Line width"
            />
          </Slider.Root>
          <span className="w-8 text-right">{styleBuffer.lineWidth}</span>
        </div>
      </div>

      <PrimaryButton
        onClick={() => {
          setCurrentStyle(styleBuffer);
          setIsStyleDialogOpen(false);
        }}
      >
        Save changes
      </PrimaryButton>
    </BaseDialog>
  );
}
