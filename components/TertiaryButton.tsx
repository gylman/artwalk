"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import useRipple from "use-ripple-hook";

export default function TertiaryButton({
  children,
  onClick,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const [ripple, event] = useRipple({
    color: "#4b556333",
  });

  return (
    <button
      {...props}
      ref={ripple}
      onPointerDown={event}
      onClick={onClick}
      className={`flex items-center h-12 gap-2 px-5 font-sans font-medium uppercase transition-colors duration-150 rounded-full text-gray-600 ${props.className}`}
    >
      {children}
    </button>
  );
}
