import { type SetStateAction } from "jotai";
import type { Map } from "mapbox-gl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
}

export const MapContext = createContext<MapContext | undefined>(undefined);

export function useMapContext() {
  const value = useContext(MapContext);
  if (!value) {
    throw new Error("useMapContext should be used inside <MapRoot />");
  }
  return value;
}

export function useWatchPosition({
  callback,
  onError,
  period = 10_000,
  isEnabled = false,
}) {
  const timeout = 2000;
  const fallbackTimeout = 5000;

  const onErrorWithFallback = useCallback(() => {
    navigator.geolocation.getCurrentPosition(callback, onError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: fallbackTimeout,
    });
  }, [callback, onError]);

  // To prevent the interval being reset when callback and onError has changed
  const handlersRef = useRef({
    callback,
    onError,
    onErrorWithFallback,
  });

  useEffect(() => {
    handlersRef.current = { callback, onError, onErrorWithFallback };
  }, [callback, onError, onErrorWithFallback]);

  useEffect(() => {
    if (!isEnabled) return;

    if (!navigator.geolocation) {
      handlersRef.current.onError(
        new Error("navigator.geolocation is not supported on this browser.")
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handlersRef.current.callback,
      handlersRef.current.onErrorWithFallback,
      { enableHighAccuracy: true, maximumAge: 10000, timeout }
    );

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        handlersRef.current.callback,
        handlersRef.current.onErrorWithFallback,
        { enableHighAccuracy: true, maximumAge: 10000, timeout }
      );
    }, period);

    return () => {
      clearInterval(interval);
    };
  }, [period, isEnabled]);
}