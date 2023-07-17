"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from "react";
import BackButton from "./BackButton";
import { TopBar } from "./TopBar";

export default function FullscreenDialog({
  trigger,
  title,
  children,
  open,
  setOpen,
  duration = 300,
  className,
}: PropsWithChildren<{
  trigger?: ReactNode;
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  duration?: number;
  className?: string;
}>) {
  const [delayedOpen, setDelayedOpen] = useState(open);
  const [enterOpen, setEnterOpen] = useState(open);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const close = useCallback(() => {
    if (timeoutRef.current) return;
    timeoutRef.current = setTimeout(() => {
      setDelayedOpen(false);
      timeoutRef.current = undefined;
    }, duration);

    return () => {
      setOpen(false);
      setDelayedOpen(false);
      timeoutRef.current = undefined;
    };
  }, [setOpen, duration]);

  useEffect(() => {
    if (open) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      setDelayedOpen(true);
    } else {
      close();
    }
  }, [open, close]);

  useEffect(() => {
    setTimeout(() => {
      setEnterOpen(open);
    }, 50);
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
  }, [open]);

  return (
    <Dialog.Root open={delayedOpen}>
      {trigger}
      <Dialog.Portal>
        <Dialog.Content
          className={`absolute top-0 left-0 z-30 w-full h-full bg-primary-100 transition-transform duration-300 ${
            !(open && enterOpen) && "translate-y-full"
          } ${className}`}
        >
          <TopBar backButton={<BackButton onClick={() => setOpen(false)} />}>
            <Dialog.Title className="text-3xl text-primary font-display">
              {title}
            </Dialog.Title>
          </TopBar>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
