import { type SetStateAction } from "jotai";
import type { Map } from "mapbox-gl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type Dispatch,
  type MutableRefObject,
  type RefObject,
} from "react";
import type { PathStyle, StyledPathGroup } from "../../state";

interface MapContext {
  map: MutableRefObject<Map | undefined>;
  mapContainer: RefObject<HTMLDivElement>;
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  isEnabled: boolean; // for play/pause
  setIsEnabled: (isLoaded: boolean) => void;
  styledPathGroups: StyledPathGroup[];
  setStyledPathGroups: Dispatch<SetStateAction<StyledPathGroup[]>>;
  clear: () => void;
  currentStyle: PathStyle;
  setCurrentStyle: Dispatch<SetStateAction<PathStyle>>;
  continueWalk: () => void;
}

export const MapContext = createContext<MapContext | undefined>(undefined);

export function useMapContext() {
  const value = useContext(MapContext);
  if (!value) {
    throw new Error("useMapContext should be used inside <MapRoot />");
  }
  return value;
}

export function useWatchPosition({ callback, onError, period = 4_000 }) {
  const timeout = 2000;
  const fallbackTimeout = 5000;

  const onErrorWithFallback = useCallback(() => {
    navigator.geolocation.getCurrentPosition(callback, onError, {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: fallbackTimeout,
    });
  }, [callback, onError]);

  useEffect(() => {
    if (!navigator.geolocation) {
      onError(
        new Error("navigator.geolocation is not supported on this browser.")
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(callback, onErrorWithFallback, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout,
    });

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(callback, onErrorWithFallback, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout,
      });
    }, period);

    return () => {
      clearInterval(interval);
    };
  }, [period, callback, onError, onErrorWithFallback]);
}
