import { Button, SxProps } from "@mui/material";
import type { MouseEventHandler, PropsWithChildren } from "react";

export function PrimaryButton({
  children,
  sx,
  onClick,
}: PropsWithChildren<{
  sx?: SxProps;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>) {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        padding: "0 20px",
        height: 48,
        fontSize: 14,
        borderRadius: 9999,
        color: "#C9E7AC",
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
