import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

const toneClasses = {
  neutral: {
    solid: "bg-surface-active text-text",
    soft: "bg-surface text-text-muted",
    outline: "border-line-strong text-text-muted",
    dot: "bg-text-subtle",
  },
  accent: {
    solid: "bg-accent text-on-accent",
    soft: "bg-white/12 text-text",
    outline: "border-line-accent text-text",
    dot: "bg-accent",
  },
  danger: {
    solid: "bg-danger text-white",
    soft: "bg-danger-fill text-danger",
    outline: "border-danger-line text-danger",
    dot: "bg-danger",
  },
  warning: {
    solid: "bg-warning text-ink-950",
    soft: "bg-warning-fill text-warning",
    outline: "border-warning-line text-warning",
    dot: "bg-warning",
  },
  success: {
    solid: "bg-success text-ink-950",
    soft: "bg-success-fill text-success",
    outline: "border-success-line text-success",
    dot: "bg-success",
  },
  info: {
    solid: "bg-info text-ink-950",
    soft: "bg-info-fill text-info",
    outline: "border-info-line text-info",
    dot: "bg-info",
  },
  signal: {
    solid: "bg-signal text-ink-950",
    soft: "bg-signal-fill text-signal",
    outline: "border-signal-line text-signal",
    dot: "bg-signal",
  },
} as const;

export type BadgeTone = keyof typeof toneClasses;
export type BadgeVariant = "solid" | "soft" | "outline";

const badgeVariants = cva(
  [
    "inline-flex shrink-0 items-center gap-1.5",
    "border border-transparent font-sans uppercase whitespace-nowrap",
  ],
  {
    variants: {
      size: {
        sm: "h-4 rounded-xs px-1.5 text-micro [&_svg]:size-2.5",
        md: "h-5 rounded-sm px-2 text-micro [&_svg]:size-3",
        lg: "h-6 rounded-sm px-2.5 text-overline [&_svg]:size-3.5",
      },
      pill: { true: "rounded-full", false: "" },
    },
    defaultVariants: { size: "md", pill: false },
  },
);

export interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  /** Leading status dot in the tone colour. */
  dot?: boolean;
  icon?: ReactNode;
}

/**
 * A non-interactive status marker: version stamps, ratings, counts, states.
 * If it can be clicked it is a {@link Chip}, not a badge.
 */
export function Badge({
  className,
  tone = "neutral",
  variant = "soft",
  size,
  pill,
  dot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const palette = toneClasses[tone];

  return (
    <span
      className={cn(
        badgeVariants({ size, pill }),
        palette[variant],
        variant === "solid" && "inset-shadow-edge",
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-xs", palette.dot)}
        />
      ) : null}
      {icon}
      {children}
    </span>
  );
}

const chipVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center gap-1.5",
    "rounded-md border font-sans uppercase whitespace-nowrap",
    "transition-[background-color,border-color,color] duration-100 ease-snap",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-micro [--chamfer-size:4px] [&_svg]:size-3",
        md: "h-7 px-2.5 text-control [--chamfer-size:5px] [&_svg]:size-3.5",
      },
      selected: {
        true: "bg-accent text-on-accent border-transparent inset-shadow-edge",
        false: [
          "surface-raised border-line text-text-muted",
          "[--chamfer-edge:var(--color-line)]",
          "hover:bg-surface-hover hover:text-text hover:border-line-strong",
          "hover:[--chamfer-edge:var(--color-line-strong)]",
        ],
      },
      interactive: { true: "cursor-pointer", false: "cursor-default" },
    },
    defaultVariants: { size: "md", selected: false, interactive: true },
  },
);

export interface ChipProps
  extends Omit<ComponentProps<"button">, "onSelect">,
    VariantProps<typeof chipVariants> {
  icon?: ReactNode;
  /** Shows a dedicated remove target and fires `onRemove` when hit. */
  onRemove?: () => void;
  removeLabel?: string;
}

/**
 * A selectable token: filters, tags, roles. Removal is its own hit target so
 * clicking the body never has an ambiguous meaning.
 */
export function Chip({
  className,
  size,
  selected,
  icon,
  onRemove,
  removeLabel = "Remove",
  children,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <span className="inline-flex">
      <button
        type={type}
        aria-pressed={selected ?? undefined}
        className={cn(
          // A chip with nothing wired to it should not claim to be clickable.
          chipVariants({ size, selected, interactive: Boolean(props.onClick) }),
          // The cut belongs to the outer bottom-right corner of the whole
          // chip, so a split chip hands it to the remove target instead.
          onRemove ? "rounded-r-none border-r-0" : "chamfer",
          className,
        )}
        {...props}
      >
        {icon}
        {children}
      </button>
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn(
            chipVariants({ size, selected }),
            "chamfer rounded-l-none px-1.5",
            !selected && "border-l-line",
          )}
        >
          <X />
        </button>
      ) : null}
    </span>
  );
}

export interface KeybindProps extends ComponentProps<"kbd"> {
  /** The key cap glyph, e.g. `E`, `F10`, `ESC`. */
  children: ReactNode;
  size?: "sm" | "md";
  /** Renders as if held down. */
  pressed?: boolean;
}

/**
 * A key cap. The client draws these as small bordered squares next to the
 * action they trigger; wide labels stretch the cap rather than truncating.
 */
export function Keybind({
  className,
  size = "md",
  pressed = false,
  children,
  ...props
}: KeybindProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-sm border font-sans uppercase",
        size === "sm"
          ? "h-4 min-w-4 px-1 text-micro"
          : "h-5 min-w-5 px-1.5 text-micro",
        pressed
          ? "border-line-accent bg-surface-active text-text inset-shadow-well"
          : "border-line-strong bg-surface text-text-muted inset-shadow-edge",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
