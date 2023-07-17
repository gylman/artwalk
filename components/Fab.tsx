"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import useRipple from "use-ripple-hook";

export default function Fab({
  children,
  onClick,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const [ripple, event] = useRipple({
    color: "#7135C733",
  });

  return (
    <button
      {...props}
      ref={ripple}
      onPointerDown={event}
      onClick={onClick}
      className={`h-12 w-12 rounded-2xl bg-white text-primary disabled:bg-gray-200 disabled:text-gray-500 shadow-xl shadow-primary-900/25 ${props.className}`}
    >
      <div className="pointer-events-none contents">{children}</div>
    </button>
  );
}
