"use client";

import { BottomNav } from "@/components/BottomNav";
import { queryClient } from "@/lib/query";
import { IconHeart, IconRun, IconUser } from "@tabler/icons-react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <aside className="fixed bottom-0 z-20 w-full h-14 bg-primary-100">
        <BottomNav>
          {[
            { href: "/profiles", children: "Profile", icon: IconUser },
            { href: "/challenges", children: "Challenges", icon: IconRun },
            { href: "/favorites", children: "Favorites", icon: IconHeart },
          ]}
        </BottomNav>
      </aside>
    </QueryClientProvider>
  );
}
