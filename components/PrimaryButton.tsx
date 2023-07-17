"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import useRipple from "use-ripple-hook";

export default function PrimaryButton({
  children,
  onClick,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const [ripple, event] = useRipple();

  return (
    <button
      {...props}
      ref={ripple}
      onPointerDown={event}
      onClick={onClick}
      className={`h-12 px-5 font-sans font-medium uppercase transition-colors duration-150 rounded-full bg-primary disabled:bg-gray-200 text-secondary disabled:text-gray-500 shrink-0 ${props.className}`}
    >
      <div className="pointer-events-none contents">{children}</div>
    </button>
  );
}
