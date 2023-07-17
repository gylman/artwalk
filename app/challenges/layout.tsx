"use client";

import { queryClient } from "@/lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
