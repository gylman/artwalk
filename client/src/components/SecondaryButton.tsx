import { Button, SxProps } from "@mui/material";
import type { MouseEventHandler, PropsWithChildren } from "react";

export function SecondaryButton({
  children,
  color = "primary",
  sx,
  onClick,
}: PropsWithChildren<{
  color?: string;
  sx?: SxProps;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>) {
  return (
    <Button
      variant="outlined"
      color={color}
      sx={{
        padding: "0 20px",
        height: 48,
        borderRadius: 9999,
        fontSize: 14,
        letterSpacing: "1px",
        ...sx,
      }}
      disableElevation
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
