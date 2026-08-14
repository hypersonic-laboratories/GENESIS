import type { ComponentProps, ReactNode } from "react";
import { Checkbox as RxCheckbox, RadioGroup as RxRadioGroup, Switch as RxSwitch } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";
import { useField } from "./field";

/* ---------------------------------------------------------------- Checkbox */

export interface CheckboxProps
  extends ComponentProps<typeof RxCheckbox.Root> {
  /** Clickable text tied to the control. */
  label?: ReactNode;
  /** Second line under the label. */
  description?: ReactNode;
}

export function Checkbox({
  className,
  label,
  description,
  id,
  ...props
}: CheckboxProps) {
  const field = useField();
  const controlId = id ?? field?.controlId;

  const box = (
    <RxCheckbox.Root
      id={controlId}
      className={cn(
        "group peer grid size-4 shrink-0 cursor-pointer place-items-center",
        "surface-well rounded-xs border border-line-strong",
        "inset-shadow-well",
        // Tailwind v4 compiles `scale-*` and `translate-*` to the standalone
        // `scale` and `translate` properties, so transitions must name those —
        // `transition-transform` animates nothing here.
        "transition-[background-color,border-color,scale] duration-100 ease-snap",
        // A brief dip under the pointer; the box springs back as the mark lands.
        "active:scale-90",
        "hover:border-line-accent",
        "data-[state=checked]:border-transparent data-[state=checked]:bg-accent",
        "data-[state=indeterminate]:border-transparent data-[state=indeterminate]:bg-accent",
        "data-[state=checked]:inset-shadow-edge",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <RxCheckbox.Indicator className="animate-check-pop text-on-accent">
        {props.checked === "indeterminate" ? (
          <Minus className="size-3" strokeWidth={3} />
        ) : (
          <Check className="size-3" strokeWidth={3} />
        )}
      </RxCheckbox.Indicator>
    </RxCheckbox.Root>
  );

  if (!label && !description) return box;

  return (
    <div className="flex items-start gap-2.5">
      {box}
      <div className="min-w-0">
        <label
          htmlFor={controlId}
          className="block cursor-pointer text-control text-text peer-disabled:cursor-default peer-disabled:opacity-40"
        >
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-caption text-text-faint">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Radio group */

export interface RadioGroupProps
  extends ComponentProps<typeof RxRadioGroup.Root> {}

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RxRadioGroup.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export interface RadioProps extends ComponentProps<typeof RxRadioGroup.Item> {
  label?: ReactNode;
  description?: ReactNode;
}

export function Radio({
  className,
  label,
  description,
  id,
  value,
  ...props
}: RadioProps) {
  const controlId = id ?? `radio-${value}`;

  const dot = (
    <RxRadioGroup.Item
      id={controlId}
      value={value}
      className={cn(
        "peer grid size-4 shrink-0 cursor-pointer place-items-center",
        "surface-well rounded-full border border-line-strong",
        "inset-shadow-well transition-colors duration-100 ease-snap",
        "hover:border-line-accent",
        "data-[state=checked]:border-accent",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <RxRadioGroup.Indicator className="size-2 animate-check-pop rounded-full bg-accent" />
    </RxRadioGroup.Item>
  );

  if (!label && !description) return dot;

  return (
    <div className="flex items-start gap-2.5">
      {dot}
      <div className="min-w-0">
        <label
          htmlFor={controlId}
          className="block cursor-pointer text-control text-text peer-disabled:cursor-default peer-disabled:opacity-40"
        >
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-caption text-text-faint">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Switch */

export interface ToggleProps extends ComponentProps<typeof RxSwitch.Root> {
  label?: ReactNode;
  description?: ReactNode;
  /** Puts the switch after the label, filling the row. */
  reversed?: boolean;
}

/**
 * A binary setting that applies immediately. If the change needs confirming,
 * use a checkbox inside a form instead.
 */
export function Toggle({
  className,
  label,
  description,
  reversed = false,
  id,
  ...props
}: ToggleProps) {
  const field = useField();
  const controlId = id ?? field?.controlId;

  const control = (
    <RxSwitch.Root
      id={controlId}
      className={cn(
        "group peer relative h-5 w-9 shrink-0 cursor-pointer rounded-full border",
        "surface-well border-line-strong inset-shadow-well",
        "transition-colors duration-150 ease-snap",
        "hover:border-line-accent",
        "data-[state=checked]:border-transparent data-[state=checked]:bg-accent",
        "data-[state=checked]:inset-shadow-edge",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <RxSwitch.Thumb
        className={cn(
          "block h-3.5 w-3.5 translate-x-0.5 rounded-full",
          "bg-text-subtle shadow-flush",
          "transition-[translate,background-color,width] duration-150 ease-snap",
          // Stretches while held, then settles — the thumb reads as something
          // being pushed across rather than teleporting.
          "group-active:w-5",
          "data-[state=checked]:translate-x-4 data-[state=checked]:bg-on-accent",
          "data-[state=checked]:group-active:translate-x-2.5",
        )}
      />
    </RxSwitch.Root>
  );

  if (!label && !description) return control;

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        reversed && "flex-row-reverse justify-between",
      )}
    >
      {control}
      <div className="min-w-0">
        <label
          htmlFor={controlId}
          className="block cursor-pointer text-control text-text peer-disabled:cursor-default peer-disabled:opacity-40"
        >
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-caption text-text-faint">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
