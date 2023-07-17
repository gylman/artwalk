"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { MouseEventHandler } from "react";
import useRipple from "use-ripple-hook";

export default function BackButton({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const [ripple, event] = useRipple({
    color: "#7135C733",
  });
  return (
    <button
      ref={ripple}
      onPointerDown={event}
      className="grid w-12 h-12 rounded-full overflow-clip place-items-center"
      onClick={onClick}
    >
      <IconArrowLeft />
    </button>
  );
}
