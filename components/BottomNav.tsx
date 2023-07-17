"use client";

import type { TablerIconsProps } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";
import useRipple from "use-ripple-hook";

interface BottomNavItemProps {
  href: string;
  active: boolean;
  icon: (props: TablerIconsProps) => JSX.Element;
}

export function BottomNavItem({
  children,
  href,
  active,
  icon: Icon,
}: PropsWithChildren<BottomNavItemProps>) {
  const [ripple, event] = useRipple({
    color: "#7135C733",
  });

  return (
    <li className="contents">
      <Link href={href} className="contents">
        <button
          ref={ripple}
          onPointerDown={event}
          className={`flex-1 min-w-0 h-14 px-4 font-sans text-xs flex flex-col items-center justify-center font-medium uppercase transition-colors duration-150 ${
            active ? "text-primary" : "text-gray-500"
          }`}
        >
          <Icon size={24} />
          {children}
        </button>
      </Link>
    </li>
  );
}

export function BottomNav({
  children,
}: {
  children: PropsWithChildren<{
    href: string;
    icon: (props: TablerIconsProps) => JSX.Element;
  }>[];
}) {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    children.findIndex(({ href }) => pathname.startsWith(href)),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <ul className="relative flex bg-primary-100">
      {children.map(({ href, icon, children }, index) => (
        <BottomNavItem
          key={href}
          href={href}
          active={index === activeIndex}
          icon={icon}
        >
          {children}
        </BottomNavItem>
      ))}
    </ul>
  );
}
