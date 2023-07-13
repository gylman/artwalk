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
import { type SetStateAction } from "jotai";
import type { GeoJSONSource, Map } from "mapbox-gl";
import {
  type MutableRefObject,
  type RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
} from "react";
import { RgbColorPicker } from "react-colorful";
import { env } from "../../env";
import type { PathStyle, StyledPathGroup } from "../../state";
import { getCirclePaint, getPathPaint } from "./utils";

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
