import type { PropsWithChildren, ReactNode } from "react";

export function TopBar({
  children,
  backButton,
}: PropsWithChildren<{ backButton?: ReactNode }>) {
  return (
    <section className="sticky top-0 flex items-center h-20 px-4 gap-x-4 text-primary">
      {backButton}
      {children}
    </section>
  );
}
