"use client";

import { BottomNav } from "@/components/BottomNav";
import SecondaryButton from "@/components/SecondaryButton";
import TertiaryButton from "@/components/TertiaryButton";
import { IconHeart, IconLoader2, IconRun, IconUser } from "@tabler/icons-react";
import { Fragment, Suspense } from "react";
import FilterProvider from "./FilterProvider";
import { Tabs } from "./Tab";

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <aside className="fixed top-0 z-20 w-full bg-primary-100">
        <Tabs>
          {[
            { href: "/challenges/competitive", children: "Competitive" },
            { href: "/challenges/creative", children: "Creative" },
          ]}
        </Tabs>
      </aside>
      <main className="p-6 pt-[4.5rem] pb-20">
        <FilterProvider>
          <ul className="flex flex-col items-stretch gap-6">
            <Suspense
              fallback={
                <>
                  <TemplateCard />
                  <TemplateCard />
                </>
              }
            >
              {children}
            </Suspense>
          </ul>
        </FilterProvider>
      </main>
      <aside className="fixed bottom-0 z-20 w-full h-14 bg-primary-100">
        <BottomNav>
          {[
            { href: "/profiles", children: "Profile", icon: IconUser },
            { href: "/challenges", children: "Challenges", icon: IconRun },
            { href: "/favorites", children: "Favorites", icon: IconHeart },
          ]}
        </BottomNav>
      </aside>
    </>
  );
}

function TemplateCard() {
  return (
    <div
      className="w-full p-2 pb-0 text-left bg-gray-200 shadow-lg rounded-2xl overflow-clip animate-fade-in shadow-gray-900/10"
      style={{
        animationFillMode: "forwards",
      }}
    >
      <section className="w-full h-48 rounded-lg bg-gray-50 overflow-clip animate-pulse" />
      <article className="p-4">
        <div className="flex items-center h-8 mb-4">
          <div className="flex-1 w-1/2 h-4 min-w-0 text-2xl font-medium truncate rounded-full bg-gray-50 font-display animate-pulse" />
        </div>
        <section
          className="grid grid-cols-1"
          style={{
            gridTemplateRows: "repeat(2, 1.75rem)",
          }}
        >
          <div>
            <span className="inline-block w-7/12 h-3 bg-gray-50 animate-pulse rounded-full mr-[8.33%]" />
            <span className="inline-block w-1/3 h-3 rounded-full bg-gray-50 animate-pulse" />
          </div>
          <div>
            <span className="inline-block w-full h-3 rounded-full bg-gray-50 animate-pulse" />
          </div>
        </section>
      </article>
    </div>
  );
}
