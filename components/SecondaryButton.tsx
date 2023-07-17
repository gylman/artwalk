"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import useRipple from "use-ripple-hook";

export default function SecondaryButton({
  children,
  onClick,
  warn,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { warn?: boolean }
>) {
  const [ripple, event] = useRipple({
    color: "#7135C733",
  });

  return (
    <button
      {...props}
      ref={ripple}
      onPointerDown={event}
      onClick={onClick}
      className={`flex items-center h-12 gap-2 px-5 font-sans font-medium uppercase transition-colors duration-150 border rounded-full ${
        warn ? "border-red-500 text-red-500" : "border-primary text-primary"
      } ${props.className}`}
    >
      {children}
    </button>
  );
}
