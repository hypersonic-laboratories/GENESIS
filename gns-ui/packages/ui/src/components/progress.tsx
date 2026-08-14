import { useId, type ComponentProps, type ReactNode } from "react";
import { Progress as RxProgress } from "radix-ui";
import { cn } from "../lib/cn";
import type { Tone } from "./feedback";

/* Bars carry `signal` and `accent` on top of the alert tones: a readout is a
 * quantity, not a severity, so it may sit outside the good/bad axis. */
export type BarTone = Tone | "accent" | "signal";

/* Tones are set as text colour so the fill can use `currentColor` — that is
 * what lets the leading segment glow in its own hue without a lookup table. */
const toneText: Record<BarTone, string> = {
  neutral: "text-text-subtle",
  accent: "text-accent",
  signal: "text-signal",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const barSizes = { sm: "h-1.5", md: "h-2", lg: "h-3" } as const;

export type BarSize = keyof typeof barSizes;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

interface SegmentBarProps {
  /** 0–1. Ignored when `indeterminate`. */
  ratio: number;
  steps: number;
  tone: BarTone;
  size: BarSize;
  indeterminate?: boolean;
  className?: string;
}

/**
 * A bar drawn as discrete notches rather than one continuous fill.
 *
 * Reading a value off a smooth bar means estimating a proportion; counting
 * notches is exact, which is why instrumentation tends to be stepped. The
 * segment at the head fills partially, so precision does not drop to 1/steps.
 */
function SegmentBar({
  ratio,
  steps,
  tone,
  size,
  indeterminate = false,
  className,
}: SegmentBarProps) {
  const filled = clamp01(ratio) * steps;

  return (
    <div
      className={cn("flex gap-[3px]", barSizes[size], toneText[tone], className)}
    >
      {Array.from({ length: steps }).map((_, index) => {
        const fill = clamp01(filled - index);
        // The head is the one segment that is neither empty nor complete.
        const isHead = fill > 0 && fill < 1;

        return (
          <span
            key={index}
            className={cn(
              "relative h-full flex-1 overflow-hidden rounded-xs bg-track",
              indeterminate && "animate-step-pulse bg-current",
            )}
            style={
              indeterminate
                ? { animationDelay: `${index * 55}ms` }
                : undefined
            }
          >
            {!indeterminate && fill > 0 ? (
              <span
                style={{ width: `${fill * 100}%` }}
                className={cn(
                  "absolute inset-y-0 left-0 rounded-xs bg-current",
                  "transition-[width] duration-200 ease-out-quart",
                  isHead && "shadow-[0_0_6px_currentColor]",
                )}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export interface ProgressProps
  extends Omit<ComponentProps<typeof RxProgress.Root>, "value"> {
  /** 0–`max`. Pass `null` for work of unknown length. */
  value: number | null;
  max?: number;
  tone?: BarTone;
  size?: BarSize;
  label?: ReactNode;
  /** Glyph beside the label, in either placement. */
  icon?: ReactNode;
  /** Hide the label without unwiring it — for a caller toggling chrome. */
  showLabel?: boolean;
  /** Print the value. Independent of the label. */
  showValue?: boolean;
  /**
   * `outside` puts the caption above the bar, which keeps the bar itself thin.
   * `inside` sets it on the bar, where it costs no extra vertical space.
   */
  labelPlacement?: "outside" | "inside";
  /** Overrides the printed value. Receives the raw value, its max and 0–1. */
  formatValue?: (value: number, max: number, ratio: number) => ReactNode;
  /** Notch count. Fewer reads coarser and holds up better in narrow columns. */
  steps?: number;
}

/** Taller than the plain bar: the caption has to fit on it. */
const insideSizes = { sm: "h-5", md: "h-6", lg: "h-8" } as const;
const insideText = { sm: "text-micro", md: "text-micro", lg: "text-overline" } as const;

/**
 * Progress of a task the interface started. For a level or a reading, use
 * {@link Meter}.
 */
export function Progress({
  className,
  value,
  max = 100,
  tone = "accent",
  size = "md",
  label,
  icon,
  showLabel = true,
  showValue = false,
  labelPlacement = "outside",
  formatValue,
  steps = 20,
  ...props
}: ProgressProps) {
  const indeterminate = value === null;
  const ratio = indeterminate ? 0 : clamp01(value / max);

  const hasLabel = Boolean(label) && showLabel;
  const hasValue = showValue && !indeterminate;
  const printed = indeterminate
    ? null
    : formatValue
      ? formatValue(value, max, ratio)
      : `${Math.round(ratio * 100)}%`;

  const labelNode =
    icon || hasLabel ? (
      <span className="flex min-w-0 items-center gap-1.5 [&_svg]:size-3 [&_svg]:shrink-0">
        {icon}
        {hasLabel ? <span className="truncate">{label}</span> : null}
      </span>
    ) : null;

  const valueNode = hasValue ? (
    <span className="shrink-0" data-numeric>
      {printed}
    </span>
  ) : null;

  const bar = (
    <RxProgress.Root
      value={indeterminate ? null : value}
      max={max}
      // A bar with a visible caption still has no accessible name of its own:
      // nothing associates the two. Borrow the label when it is plain text,
      // and let an explicit `aria-label` in `props` win.
      aria-label={typeof label === "string" ? label : undefined}
      className="block w-full"
      {...props}
    >
      <SegmentBar
        ratio={ratio}
        steps={steps}
        tone={tone}
        size={size}
        indeterminate={indeterminate}
        // Overrides the height from `size`; last class wins the merge.
        className={labelPlacement === "inside" ? insideSizes[size] : undefined}
      />
    </RxProgress.Root>
  );

  if (labelPlacement === "outside") {
    return (
      <div className={cn("w-full", className)}>
        {labelNode || valueNode ? (
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-overline text-text-subtle">
            {labelNode ?? <span />}
            {valueNode}
          </div>
        ) : null}
        {bar}
      </div>
    );
  }

  /*
   * The caption rides on its own plaque rather than directly on the bar.
   *
   * Swapping the text between a light and a dark coat at the fill boundary
   * kept the contrast ratio honest, but not the legibility: the words still
   * had to be read across a row of notches and gaps, and broken text is hard
   * to read whatever its colour. A small card underneath gives every glyph
   * the same quiet background, and reads as a plate laid over the bar.
   */
  const plaque = cn(
    "flex items-center gap-1.5 rounded-xs border border-line",
    "bg-ink-950/85 px-1.5 py-0.5 leading-none",
    "inset-shadow-edge shadow-flush",
    "text-text",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  );

  return (
    <div className={cn("relative w-full", className)}>
      {bar}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center gap-2 px-1",
          labelNode ? "justify-between" : "justify-end",
          insideText[size],
          "uppercase",
        )}
      >
        {labelNode ? <span className={cn(plaque, "min-w-0")}>{labelNode}</span> : null}
        {valueNode ? <span className={plaque}>{valueNode}</span> : null}
      </div>
    </div>
  );
}

export interface CircularProgressProps {
  /** 0–`max`. Pass `null` for work of unknown length. */
  value: number | null;
  max?: number;
  /** Outer diameter in pixels. */
  size?: number;
  /** Ring thickness in pixels. */
  thickness?: number;
  /** Notch count around the ring. */
  steps?: number;
  tone?: BarTone;
  /** Caption under the value. */
  label?: ReactNode;
  showValue?: boolean;
  /** Replaces the centre entirely — an icon, a count, a unit. */
  children?: ReactNode;
  className?: string;
}

/**
 * The stepped bar, wrapped into a ring.
 *
 * Use it where the value is the whole point of the block — a loading gate, a
 * cooldown, a capacity dial — and the linear bar where progress is one line of
 * information among several.
 *
 * The geometry is done in a 0–100 viewBox with `pathLength={100}`, so every
 * dash length below is a literal percentage regardless of the rendered size.
 * The notches come from a dash pattern; an arc-shaped mask decides how much of
 * that pattern is lit, which is what lets the leading notch fill partially.
 */
export function CircularProgress({
  value,
  max = 100,
  size = 72,
  thickness = 6,
  steps = 32,
  tone = "accent",
  label,
  showValue = true,
  children,
  className,
}: CircularProgressProps) {
  const maskId = useId();
  const indeterminate = value === null;
  const ratio = indeterminate ? 0.25 : clamp01(value / max);

  const stroke = (thickness * 100) / size;
  const radius = 50 - stroke / 2;
  const pitch = 100 / steps;
  const gap = pitch * 0.3;
  const dash = `${pitch - gap} ${gap}`;

  const ring = {
    cx: 50,
    cy: 50,
    r: radius,
    fill: "none",
    strokeWidth: stroke,
    pathLength: 100,
    // Start at twelve o'clock rather than three.
    transform: "rotate(-90 50 50)",
  } as const;

  return (
    <div
      className={cn("relative inline-grid place-items-center", toneText[tone], className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={typeof label === "string" ? label : undefined}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn("size-full", indeterminate && "animate-spin [animation-duration:1.6s]")}
      >
        <defs>
          <mask id={maskId}>
            <circle
              {...ring}
              stroke="white"
              strokeDasharray={`${ratio * 100} 100`}
            />
          </mask>
        </defs>

        <circle {...ring} className="stroke-track" strokeDasharray={dash} />
        <g mask={`url(#${maskId})`}>
          <circle {...ring} className="stroke-current" strokeDasharray={dash} />
        </g>
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        {children ?? (
          <div>
            {showValue && !indeterminate ? (
              <p className="text-heading text-text" data-numeric>
                {Math.round(ratio * 100)}
                <span className="text-caption text-text-subtle">%</span>
              </p>
            ) : null}
            {label ? (
              <p className="text-micro uppercase text-text-faint">{label}</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export interface FillProgressProps {
  value: number;
  max?: number;
  /**
   * `fill` floods the tile from the bottom behind the icon — best for a value
   * read at a glance, in a row of other tiles.
   *
   * `fill-around` keeps the tile dark and tracks the value on a rule running
   * around it, which stays legible when the icon itself must keep its colour.
   */
  variant?: "fill" | "fill-around";
  /** Centred glyph. The whole point of the tile — pass one. */
  icon?: ReactNode;
  tone?: BarTone;
  /** Total footprint in pixels, ring included. */
  size?: number;
  /** Prints the value across the bottom of the tile. */
  showValue?: boolean;
  /** Overrides the printed value — units, a fraction, a countdown. */
  readout?: ReactNode;
  /** Announced to assistive tech; the glyph alone says nothing. */
  label?: string;
  className?: string;
}

/**
 * A square status tile: the HUD vocabulary for health, armour, thirst, hunger,
 * stamina and their kin.
 *
 * Reported as a `meter`, not a `progressbar` — this is a level within a known
 * range, not the progress of a task the interface started.
 */
export function FillProgress({
  value,
  max = 100,
  variant = "fill",
  icon,
  tone = "accent",
  size = 48,
  showValue = false,
  readout,
  label,
  className,
}: FillProgressProps) {
  const ratio = clamp01(value / max);
  const around = variant === "fill-around";

  // Everything scales off `size` so a tile keeps its proportions at any
  // footprint. Radius tracks the box rather than sitting at a fixed 4px:
  // corner softness belongs to the scale of the shape, and these are large.
  const radius = Math.round(size * 0.2);
  const ringWidth = Math.max(2, Math.round(size * 0.06));
  const ringGap = Math.max(2, Math.round(size * 0.06));
  const inset = around ? ringWidth + ringGap : 0;
  const innerSize = size - inset * 2;
  // The tile is border-box with a 1px border, so its padding box — the frame
  // the flood and both glyph coats are positioned against — is 2px shorter.
  const innerContent = innerSize - 2;
  const innerRadius = Math.max(2, radius - inset);
  const glyph = Math.round(innerSize * 0.42);

  // The ring is stroked in viewBox units; `pathLength` normalises the
  // perimeter so the dash below is a plain percentage.
  const strokeUnits = (ringWidth * 100) / size;
  const ringRect = {
    x: strokeUnits / 2,
    y: strokeUnits / 2,
    width: 100 - strokeUnits,
    height: 100 - strokeUnits,
    rx: ((radius - ringWidth / 2) * 100) / size,
    fill: "none",
    strokeWidth: strokeUnits,
    pathLength: 100,
  } as const;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("relative shrink-0", toneText[tone], className)}
      style={{ width: size, height: size }}
    >
      {around ? (
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
          <rect {...ringRect} className="stroke-track" />
          <rect
            {...ringRect}
            className="stroke-current transition-[stroke-dasharray] duration-200 ease-out-quart"
            strokeDasharray={`${ratio * 100} 100`}
            strokeLinecap="butt"
          />
        </svg>
      ) : null}

      <div
        className={cn(
          "absolute grid place-items-center overflow-hidden",
          "border border-line inset-shadow-edge",
          // A vignette pulls the corners down and gives the tile a bowl shape
          // instead of a flat swatch.
          "shadow-[inset_0_0_10px_rgb(0_0_0/0.4)]",
          around ? "surface-raised" : "bg-track",
        )}
        style={{
          inset,
          borderRadius: innerRadius,
        }}
      >
        {/*
         * The glyph is painted twice.
         *
         * A single colour cannot work here: white vanishes on a yellow or
         * acid-green fill, and a dark glyph vanishes on the empty track above
         * it. So a light coat goes down first and the flood is drawn over it
         * carrying a dark coat of its own — the waterline decides which one
         * you see. Contrast holds for every tone at every level, and the icon
         * appears to submerge as the value rises.
         *
         * Order matters: both layers are positioned with an automatic z-index,
         * so the flood must come after the light glyph in the DOM to cover it.
         */}
        {icon ? (
          <span
            className={cn(
              "relative grid place-items-center [&_svg]:size-full",
              around
                ? // Outlined tiles keep the tone and lift it off the surface.
                  "text-current drop-shadow-[0_0_6px_currentColor]"
                : "text-white/55",
              showValue && "-translate-y-[8%]",
            )}
            style={{ width: glyph, height: glyph }}
          >
            {icon}
          </span>
        ) : null}

        {!around ? (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 overflow-hidden",
              "transition-[height] duration-200 ease-out-quart",
            )}
            style={{ height: `${ratio * 100}%` }}
          >
            <span
              className={cn(
                "absolute inset-0 bg-current",
                // Depth in the body of the liquid: darker the further down.
                "bg-linear-to-t from-black/30 to-transparent to-60%",
              )}
            />
            {/* Waterline: catches the light and keeps the fill from reading as
             * a flat block of colour. */}
            <span className="absolute inset-x-0 top-0 h-px bg-white/30" />

            {icon ? (
              <span
                className="absolute inset-x-0 bottom-0 grid place-items-center"
                style={{ height: innerContent }}
              >
                <span
                  className={cn(
                    "grid place-items-center text-ink-950/70 [&_svg]:size-full",
                    showValue && "-translate-y-[8%]",
                  )}
                  style={{ width: glyph, height: glyph }}
                >
                  {icon}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}

        {showValue ? (
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 text-center",
              "bg-ink-950/55 text-micro text-white",
            )}
            data-numeric
          >
            {readout ?? Math.round(value)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export interface MeterProps extends ComponentProps<"div"> {
  value: number;
  min?: number;
  max?: number;
  /** Semantic role of the current reading. Thresholds belong to the caller. */
  tone?: BarTone;
  size?: BarSize;
  label?: ReactNode;
  icon?: ReactNode;
  /** Right-aligned readout; defaults to `value/max`. */
  readout?: ReactNode;
  /**
   * Draw the bar as this many notches. Use it when the underlying quantity is
   * itself discrete — inventory slots, charges, lives.
   */
  segments?: number;
}

/**
 * A current reading against a known range: health, armour, hunger, capacity.
 * The component renders whatever state it is given — deciding when a value
 * becomes `warning` or `danger` is gameplay logic and stays with the caller.
 */
export function Meter({
  className,
  value,
  min = 0,
  max = 100,
  tone = "accent",
  size = "md",
  label,
  icon,
  readout,
  segments,
  ...props
}: MeterProps) {
  const ratio = clamp01((value - min) / (max - min));

  return (
    <div className={cn("w-full", className)} {...props}>
      {label || readout ? (
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-overline text-text-subtle [&_svg]:size-3">
            {icon}
            {label}
          </span>
          <span className="text-caption text-text-muted" data-numeric>
            {readout ?? `${Math.round(value)}/${max}`}
          </span>
        </div>
      ) : null}

      <div
        role="meter"
        aria-label={typeof label === "string" ? label : undefined}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
      >
        {segments && segments > 1 ? (
          <SegmentBar ratio={ratio} steps={segments} tone={tone} size={size} />
        ) : (
          // A continuous quantity gets a continuous bar: health does not come
          // in units, and notching it would imply it does.
          <div
            className={cn(
              "overflow-hidden rounded-xs bg-track",
              "inset-shadow-well",
              barSizes[size],
              toneText[tone],
            )}
          >
            <div
              style={{ width: `${ratio * 100}%` }}
              className="h-full rounded-xs bg-current transition-[width] duration-200 ease-out-quart"
            />
          </div>
        )}
      </div>
    </div>
  );
}
