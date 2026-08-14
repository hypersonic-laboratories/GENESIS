import { useState, type ComponentProps, type ReactNode } from "react";
import { Slider as RxSlider } from "radix-ui";
import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/cn";
import { useField } from "./field";

export interface SliderProps extends ComponentProps<typeof RxSlider.Root> {
  /** Live value readout to the right of the track. */
  showValue?: boolean;
  /** Formats the readout — units, percentages, currency. */
  formatValue?: (value: number[]) => ReactNode;
  /**
   * Divide the track into this many notches. Gives the eye something to
   * measure against on a range whose extremes are not self-evident.
   */
  ticks?: number;
  /** Labels for the handles, in order. Ranges get "Minimum"/"Maximum". */
  thumbLabels?: string[];
}

/**
 * A continuous value.
 *
 * Squared off rather than pill-shaped, and the handle is a vertical bar
 * overhanging the track — the same instrument vocabulary as the stepped
 * progress bars, instead of the round knob of a generic web slider.
 *
 * One handle is rendered per value, so a two-value range gets two; the fill
 * spans the selected interval rather than starting at zero.
 */
export function Slider({
  className,
  showValue = false,
  formatValue,
  ticks,
  thumbLabels,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  ...props
}: SliderProps) {
  /*
   * Radix can run uncontrolled, but then the readout beside the track has
   * nothing to follow and freezes at `defaultValue`. Mirroring the value here
   * keeps an uncontrolled slider's label live without forcing every caller to
   * hold state for a control they were happy to leave alone.
   */
  // Falls back to `min`, not to zero: a slider spanning 60–120 with no default
  // would otherwise start at a value outside its own range.
  const [uncontrolled, setUncontrolled] = useState<number[]>(
    defaultValue ?? [min],
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;

  const handleValueChange = (next: number[]) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const readout = formatValue ? formatValue(current) : current.join(" – ");
  const vertical = props.orientation === "vertical";

  const labelFor = (index: number) => {
    if (thumbLabels?.[index]) return thumbLabels[index];
    if (current.length === 1) return "Value";
    return index === 0 ? "Minimum" : "Maximum";
  };

  return (
    <div className="flex items-center gap-3">
      <RxSlider.Root
        value={current}
        onValueChange={handleValueChange}
        min={min}
        className={cn(
          "relative flex h-6 flex-1 touch-none select-none items-center",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-6 data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      >
        <RxSlider.Track
          className={cn(
            "relative grow overflow-hidden rounded-xs bg-track",
            "inset-shadow-well",
            "h-2 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2",
          )}
        >
          <RxSlider.Range
            className={cn(
              "absolute h-full rounded-xs bg-accent",
              "bg-linear-to-b from-white to-[#c9cdd1]",
              "data-[orientation=vertical]:w-full",
            )}
          />
        </RxSlider.Track>

        {/* Drawn after the track so the notches read on top of the fill. */}
        {ticks && ticks > 1 && !vertical ? (
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="flex h-2 w-full">
              {Array.from({ length: ticks }).map((_, index) => (
                <span
                  key={index}
                  className="h-full flex-1 border-r border-ink-950/45 last:border-r-0"
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* One handle per value — a range needs both ends, not just its start. */}
        {current.map((_, index) => (
          <RxSlider.Thumb
            key={index}
            aria-label={labelFor(index)}
            className={cn(
              "relative block h-5 w-1.5 cursor-grab rounded-xs bg-accent",
              "border border-ink-950/50 drop-shadow-raised",
              "outline-none active:cursor-grabbing",
              // The halo grows on a pseudo-element: Radix drives the thumb's own
              // transform for positioning, so nothing here may touch it.
              "before:absolute before:-inset-x-1 before:-inset-y-1 before:rounded-sm",
              "before:bg-white/0 before:transition-colors before:duration-100",
              "hover:before:bg-white/15",
              "focus-visible:before:bg-white/20",
              "focus-visible:shadow-glow-accent",
              "data-[orientation=vertical]:h-1.5 data-[orientation=vertical]:w-5",
            )}
          />
        ))}
      </RxSlider.Root>

      {showValue ? (
        <output
          className={cn(
            "shrink-0 rounded-md border border-line px-2 py-0.5",
            "surface-well inset-shadow-well",
            "text-center text-control text-text",
            // Wide enough that a range keeps its width as the digits change.
            current.length > 1 ? "min-w-20" : "min-w-14",
          )}
          data-numeric
        >
          {readout}
        </output>
      ) : null}
    </div>
  );
}

export interface NumberStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Short unit rendered after the number. */
  unit?: ReactNode;
  className?: string;
  id?: string;
}

/**
 * A bounded integer with explicit increment targets — quantities, splits,
 * slot counts. Typing is allowed; the value is clamped on change.
 */
export function NumberStepper({
  value,
  onValueChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
  unit,
  className,
  id,
}: NumberStepperProps) {
  const field = useField();
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  // Full-height segments rather than inset buttons: the whole end of the
  // control becomes the target, which is far easier to hit repeatedly.
  const stepButton = [
    "grid w-8 shrink-0 cursor-pointer place-items-center",
    "text-text-muted transition-colors duration-100",
    "hover:bg-surface-hover hover:text-text",
    "active:bg-surface-active",
    "disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent",
    "[&_svg]:size-3.5",
  ];

  return (
    <div
      className={cn(
        "inline-flex h-8 min-w-28 items-stretch overflow-hidden",
        "chamfer rounded-md border border-line",
        "surface-well inset-shadow-well",
        "[--chamfer-edge:var(--color-line)]",
        "transition-[border-color,box-shadow] duration-100 ease-snap",
        "hover:border-line-strong",
        "has-[:focus-visible]:border-line-accent has-[:focus-visible]:shadow-glow-accent",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        disabled={value <= min}
        onClick={() => onValueChange(clamp(value - step))}
        className={cn(stepButton, "border-r border-line-faint")}
      >
        <Minus />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-1 px-1">
        <input
          id={id ?? field?.controlId}
          type="text"
          inputMode="numeric"
          // While typing, the field shows the raw text. Without that, clearing
          // it to retype snaps the old value straight back in and the field
          // cannot be emptied at all.
          value={draft ?? String(value)}
          onChange={(event) => {
            const raw = event.target.value;
            setDraft(raw);

            const next = Number.parseInt(raw, 10);
            if (!Number.isNaN(next)) onValueChange(clamp(next));
          }}
          onBlur={() => setDraft(null)}
          data-numeric
          className="w-full min-w-6 bg-transparent text-center text-control text-text outline-none"
        />
        {unit ? (
          <span className="shrink-0 text-micro uppercase text-text-faint">
            {unit}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Increase"
        disabled={value >= max}
        onClick={() => onValueChange(clamp(value + step))}
        className={cn(stepButton, "border-l border-line-faint")}
      >
        <Plus />
      </button>
    </div>
  );
}
