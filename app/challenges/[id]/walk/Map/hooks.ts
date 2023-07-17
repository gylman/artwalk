import { useCallback, useEffect, useMemo } from "react";

interface UseWatchPositionOptions {
  callback(position: GeolocationPosition): void;
  onError?(error: Error | GeolocationPositionError): void;
  period?: number;
  getCurrentPosition?: typeof navigator.geolocation.getCurrentPosition;
}
export function useWatchPosition({
  callback,
  onError,
  period = 4_000,
  getCurrentPosition,
}: UseWatchPositionOptions) {
  const timeout = 2000;
  const fallbackTimeout = 5000;

  const gCP = useMemo(
    () =>
      getCurrentPosition ??
      (typeof navigator === "undefined"
        ? () => {}
        : navigator.geolocation?.getCurrentPosition.bind(
            navigator.geolocation,
          )),
    [getCurrentPosition],
  );

  const onErrorWithFallback = useCallback(() => {
    gCP(callback, onError, {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: fallbackTimeout,
    });
  }, [callback, onError, gCP]);

  useEffect(() => {
    if (!navigator.geolocation) {
      onError?.(
        new Error("navigator.geolocation is not supported on this browser."),
      );
      return;
    }

    gCP(callback, onErrorWithFallback, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout,
    });

    const interval = setInterval(() => {
      gCP(callback, onErrorWithFallback, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout,
      });
    }, period);

    return () => {
      clearInterval(interval);
    };
  }, [period, callback, onError, onErrorWithFallback, gCP]);
}
