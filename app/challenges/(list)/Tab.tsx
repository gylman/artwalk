"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";
import useRipple from "use-ripple-hook";

interface TabProps {
  href: string;
  active: boolean;
}

export function Tab({ children, href, active }: PropsWithChildren<TabProps>) {
  const [ripple, event] = useRipple({
    color: "#7135C733",
  });

  return (
    <li className="contents">
      <Link href={href} className="contents">
        <button
          ref={ripple}
          onPointerDown={event}
          className={`flex-1 min-w-0 h-12 px-4 font-sans text-sm font-medium uppercase transition-colors duration-150 ${
            active ? "text-primary" : "text-gray-500"
          }`}
        >
          {children}
        </button>
      </Link>
    </li>
  );
}

export function Tabs({
  children,
}: {
  children: PropsWithChildren<{ href: string }>[];
}) {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    children.findIndex(({ href }) => pathname === href),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <ul className="relative flex shadow-lg bg-primary-100 shadow-primary-900/10">
      {children.map(({ href, children }, index) => (
        <Tab key={href} href={href} active={index === activeIndex}>
          {children}
        </Tab>
      ))}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 bg-primary transition-transform"
        style={{
          width: `${100 / children.length}%`,
          transform: `translateX(${100 * activeIndex}%)`,
        }}
      />
    </ul>
  );
}
