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

export default function BaseDialog({
  trigger,
  title,
  children,
  open,
  setOpen,
  duration = 300,
  className,
}: PropsWithChildren<{
  trigger?: ReactNode;
  title?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  duration?: number;
  className?: string;
}>) {
  const [delayedOpen, setDelayedOpen] = useState(open);
  const [enterOpen, setEnterOpen] = useState(open);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const close = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      setDelayedOpen(false);
      timeoutRef.current = undefined;
    }, duration);

    return () => {
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
        <div
          className="absolute top-0 left-0 z-50 grid w-full h-full p-6 pointer-events-auto place-items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <Dialog.Content
            className={`absolute z-50 w-full max-w-sm max-h-full p-6 overflow-y-auto bg-white shadow-xl rounded-3xl transition-[transform,opacity] duration-300 ${
              !(open && enterOpen) && "translate-y-4 opacity-0"
            } ${className}`}
          >
            {title && (
              <Dialog.Title className="w-full text-3xl font-medium font-display">
                {title}
              </Dialog.Title>
            )}
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
