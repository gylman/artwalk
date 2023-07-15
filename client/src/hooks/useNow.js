import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const nowAtom = atom(Date.now());

export function useNow() {
  const [now] = useAtom(nowAtom);
  return now;
}

export function useNowSetter() {
  const [, setNow] = useAtom(nowAtom);
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => clearInterval(interval);
  }, [setNow]);
}
