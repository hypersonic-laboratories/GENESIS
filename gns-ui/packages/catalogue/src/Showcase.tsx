import type { ReactNode } from "react";
import { cn } from "@gns/ui";

export interface SpecProps {
  title: string;
  /** One line on when to reach for this, not what it looks like. */
  note?: ReactNode;
  children: ReactNode;
  /** Lays the preview out as a column instead of a wrapping row. */
  stack?: boolean;
  className?: string;
}

/** One component under inspection: heading, guidance, live preview. */
export function Spec({ title, note, children, stack, className }: SpecProps) {
  return (
    <section className={cn("scroll-mt-6", className)}>
      <div className="mb-3">
        <h3 className="text-subheading uppercase text-text">{title}</h3>
        {note ? (
          <p className="mt-1 max-w-prose text-caption text-text-faint">{note}</p>
        ) : null}
      </div>
      <div
        className={cn(
          "rounded-lg border border-line-faint bg-ink-950/40 p-5",
          "inset-shadow-edge",
          stack ? "flex flex-col gap-4" : "flex flex-wrap items-center gap-3",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export interface SectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <header className="mb-6 border-b border-line pb-4">
        <h2 className="text-title uppercase text-text">{title}</h2>
        <p className="mt-1 max-w-prose text-body text-text-subtle">
          {description}
        </p>
      </header>
      <div className="flex flex-col gap-10">{children}</div>
    </section>
  );
}

/** Labels a single state inside a preview row. */
export function Variant({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <span className="text-micro uppercase text-text-disabled">{label}</span>
      {children}
    </div>
  );
}
