import { useEffect } from "react";

export function useWarnOnBackButton(callback) {
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);

    const handler = () => {
      window.history.pushState(null, document.title, window.location.href);
      callback?.();
    };

    window.addEventListener("popstate", handler);

    return () => window.removeEventListener("popstate", handler);
  }, [callback]);
}
