import type { ComponentProps, ElementType, ReactNode } from "react";
import { Avatar as RxAvatar } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";

/* ------------------------------------------------------------------ Avatar */

const avatarSizes = {
  xs: "size-5 text-micro",
  sm: "size-6 text-micro",
  md: "size-8 text-control",
  lg: "size-10 text-subheading",
  xl: "size-14 text-heading",
} as const;

export type AvatarSize = keyof typeof avatarSizes;

export interface AvatarProps extends ComponentProps<typeof RxAvatar.Root> {
  src?: string;
  alt?: string;
  /** Shown while the image loads and if it fails — usually initials. */
  fallback?: ReactNode;
  size?: AvatarSize;
  /** Presence dot in the lower-right corner. */
  status?: "online" | "away" | "busy" | "offline";
  /** Circular instead of the default squared-off frame. */
  round?: boolean;
}

const statusColors = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-danger",
  offline: "bg-ink-500",
} as const;

export function Avatar({
  className,
  src,
  alt,
  fallback,
  size = "md",
  status,
  round = false,
  ...props
}: AvatarProps) {
  return (
    <span className="relative inline-flex shrink-0">
      <RxAvatar.Root
        className={cn(
          "inline-flex select-none items-center justify-center overflow-hidden",
          "surface-raised border border-line inset-shadow-edge",
          round ? "rounded-full" : "rounded-md",
          avatarSizes[size],
          className,
        )}
        {...props}
      >
        <RxAvatar.Image
          src={src}
          alt={alt}
          className="size-full object-cover"
        />
        <RxAvatar.Fallback className="font-sans uppercase text-text-subtle">
          {fallback}
        </RxAvatar.Fallback>
      </RxAvatar.Root>

      {status ? (
        <span
          aria-label={status}
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2 rounded-full",
            "border-2 border-ink-900",
            statusColors[status],
          )}
        />
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------- Stat */

export interface StatProps extends ComponentProps<"div"> {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** Secondary line under the value. */
  hint?: ReactNode;
  /** Signed change indicator, coloured by direction. */
  delta?: { value: ReactNode; direction: "up" | "down" | "flat" };
  align?: "start" | "center" | "end";
}

const deltaColors = {
  up: "text-success",
  down: "text-danger",
  flat: "text-text-faint",
} as const;

/*
 * Drawn as icons rather than ▲▼: those glyphs sit at U+25B2/U+25BC, outside
 * the latin subset we bundle, so the client would silently fall back to a
 * system font for them — a different shape and weight from everything else on
 * the row.
 */
const deltaIcons = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
} as const;

/** A single headline number with its label. */
export function Stat({
  className,
  label,
  value,
  icon,
  hint,
  delta,
  align = "start",
  ...props
}: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "center" && "items-center text-center",
        align === "end" && "items-end text-right",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-1.5 text-overline text-text-subtle [&_svg]:size-3">
        {icon}
        {label}
      </span>
      <span className="text-title text-text" data-numeric>
        {value}
      </span>
      {delta || hint ? (
        <span className="flex items-center gap-2 text-caption">
          {delta ? (
            (() => {
              const Icon = deltaIcons[delta.direction];
              return (
                <span
                  className={cn(
                    "flex items-center gap-1",
                    deltaColors[delta.direction],
                  )}
                  data-numeric
                >
                  <Icon className="size-3 shrink-0" aria-hidden />
                  {delta.value}
                </span>
              );
            })()
          ) : null}
          {hint ? <span className="text-text-faint">{hint}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

export interface DataRowProps extends ComponentProps<"div"> {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
}

/**
 * A label/value pair on one line — the metadata rows the client uses for
 * build numbers, timestamps and counts.
 */
export function DataRow({
  className,
  label,
  value,
  icon,
  ...props
}: DataRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-1",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2 text-overline text-text-subtle [&_svg]:size-3 [&_svg]:shrink-0">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span
        className="shrink-0 text-overline text-text"
        data-numeric
      >
        {value}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------- ListRow */

const listRowVariants = cva(
  [
    "group flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left",
    "transition-[background-color,border-color] duration-100 ease-snap",
  ],
  {
    variants: {
      interactive: {
        true: "cursor-pointer hover:bg-surface-hover hover:border-line-strong",
        false: "",
      },
      selected: {
        true: "border-line-accent bg-surface-active",
        false: "border-line-faint bg-surface",
      },
      disabled: {
        true: "pointer-events-none opacity-40",
        false: "",
      },
    },
    defaultVariants: { interactive: false, selected: false, disabled: false },
  },
);

export interface ListRowProps
  extends Omit<ComponentProps<"div">, "title">,
    VariantProps<typeof listRowVariants> {
  /** Leading visual — avatar, icon, item image. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned content — values, badges, actions. */
  trailing?: ReactNode;
  /** Render as a `<button>` when the whole row is a target. */
  as?: ElementType;
}

/** One entity in a list: player, item, transaction, server. */
export function ListRow({
  className,
  leading,
  title,
  subtitle,
  trailing,
  interactive,
  selected,
  disabled,
  as,
  ...props
}: ListRowProps) {
  const Comp = (as ?? (interactive ? "button" : "div")) as ElementType;

  return (
    <Comp
      className={cn(
        listRowVariants({ interactive, selected, disabled }),
        // The selection marker is a bar on the leading edge, matching how
        // the client marks an active row.
        selected &&
          "relative before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-accent",
        className,
      )}
      {...props}
    >
      {leading ? <span className="shrink-0">{leading}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-control uppercase text-text">
          {title}
        </span>
        {subtitle ? (
          <span className="mt-0.5 block truncate text-caption text-text-faint">
            {subtitle}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span className="flex shrink-0 items-center gap-2">{trailing}</span>
      ) : null}
    </Comp>
  );
}

/* -------------------------------------------------------------- EmptyState */

export interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  size?: "sm" | "md";
}

/** Nothing to show, and why. Always offer the way out if there is one. */
export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  size = "md",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "rounded-lg border border-dashed border-line",
        size === "sm" ? "gap-2 p-6" : "gap-3 p-10",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="grid size-10 place-items-center rounded-full bg-surface text-text-faint [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <p className="text-subheading uppercase text-text-muted">{title}</p>
      {description ? (
        <p className="max-w-xs text-caption text-text-faint">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- Skeleton */

export interface SkeletonProps extends ComponentProps<"div"> {
  /** Suppresses the travelling highlight — for very large placeholder areas. */
  still?: boolean;
}

/** A placeholder that holds the exact geometry of the content it stands in for. */
export function Skeleton({ className, still = false, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-md bg-surface", className)}
      {...props}
    >
      {/* The highlight is its own element so the sweep can be a transform.
       * Animating the parent's background position would repaint the whole
       * placeholder on every frame instead. */}
      {!still ? (
        <span className="absolute inset-0 animate-sheen bg-linear-to-r from-transparent via-white/8 to-transparent" />
      ) : null}
    </div>
  );
}
