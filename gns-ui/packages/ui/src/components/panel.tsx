import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const panelVariants = cva(
  ["relative rounded-lg border", "text-body text-text"],
  {
    variants: {
      tone: {
        /**
         * The default shell. Carries its own dark fill, because this is the
         * layer that touches the game and the scene behind it is arbitrary.
         */
        glass: ["surface-panel border-line", "inset-shadow-edge shadow-panel"],
        /** Fully opaque — dense content, long reading, screenshots. */
        solid: ["surface-solid border-line", "inset-shadow-edge shadow-panel"],
        /** Recessed — a container that reads as a hole, not a card. */
        well: ["surface-well border-line-faint", "inset-shadow-well"],
        /** Outline only, no fill. */
        bare: ["border-line bg-transparent"],
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: { tone: "glass", padding: "md" },
  },
);

export interface PanelProps
  extends ComponentProps<"section">,
    VariantProps<typeof panelVariants> {}

/**
 * The base container. Everything that needs an edge over the game world is
 * built from one of these rather than an ad-hoc div.
 */
export function Panel({ className, tone, padding, ...props }: PanelProps) {
  return (
    <section
      className={cn(panelVariants({ tone, padding }), className)}
      {...props}
    />
  );
}

export interface PanelHeaderProps
  extends Omit<ComponentProps<"header">, "title"> {
  /** Uppercase overline sitting above the title. */
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Right-aligned controls. */
  actions?: ReactNode;
}

export function PanelHeader({
  className,
  eyebrow,
  title,
  actions,
  children,
  ...props
}: PanelHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-4 border-b border-line-faint pb-3",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-overline text-text-subtle">{eyebrow}</p>
        ) : null}
        {title ? (
          <h2 className="truncate text-subheading uppercase text-text">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

export function PanelBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("py-3", className)} {...props} />;
}

export function PanelFooter({ className, ...props }: ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "flex items-center justify-end gap-2 border-t border-line-faint pt-3",
        className,
      )}
      {...props}
    />
  );
}

export interface DividerProps extends ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
  /** Fades out at both ends instead of butting into the container edge. */
  soft?: boolean;
  /** Centred caption breaking the rule in two. Horizontal only. */
  label?: ReactNode;
}

export function Divider({
  className,
  orientation = "horizontal",
  soft = false,
  label,
  ...props
}: DividerProps) {
  if (label && orientation === "horizontal") {
    return (
      <div
        className={cn("flex items-center gap-3", className)}
        role="separator"
        {...props}
      >
        <span className={cn("h-px flex-1", soft ? "rule-fade" : "bg-line")} />
        <span className="text-overline text-text-faint">{label}</span>
        <span className={cn("h-px flex-1", soft ? "rule-fade" : "bg-line")} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "horizontal"
          ? cn("h-px w-full", soft ? "rule-fade" : "bg-line")
          : "w-px self-stretch bg-line",
        className,
      )}
      {...props}
    />
  );
}
