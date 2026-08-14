import type { ComponentProps, ReactNode } from "react";
import { Select as RxSelect } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/cn";
import { controlShell, useField } from "./field";

/** Shared surface for every floating menu: select, popover, context menu. */
export const overlaySurface = [
  "z-[1400] overflow-hidden rounded-lg border border-line",
  "surface-solid inset-shadow-edge shadow-overlay",
  "backdrop-blur-md",
];

/** Shared row styling for anything that behaves like a menu item. */
export const menuItemClasses = [
  "relative flex cursor-pointer select-none items-center gap-2",
  "rounded-sm px-2 py-1.5 pr-7",
  "text-control uppercase text-text-muted outline-none",
  "transition-colors duration-75",
  "data-[highlighted]:bg-surface-hover data-[highlighted]:text-text",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
  "[&_svg]:size-3.5 [&_svg]:shrink-0",
];

export interface SelectOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends ComponentProps<typeof RxSelect.Root> {
  options?: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  className?: string;
  id?: string;
  /** Fixed width for the trigger; the menu matches it by default. */
  triggerWidth?: string;
}

const triggerSizes = {
  sm: "h-7 px-2",
  md: "h-8 px-2.5",
  lg: "h-10 px-3",
} as const;

/**
 * A single choice from a known list. Pass `options` for the common case, or
 * compose `Select.Item` children directly when items need custom rendering.
 */
export function Select({
  options,
  placeholder = "Select",
  size = "md",
  invalid,
  className,
  id,
  triggerWidth,
  children,
  ...props
}: SelectProps) {
  const field = useField();
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <RxSelect.Root {...props}>
      <RxSelect.Trigger
        id={id ?? field?.controlId}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        className={cn(
          controlShell,
          triggerSizes[size],
          "cursor-pointer justify-between uppercase",
          "data-[placeholder]:text-text-disabled",
          "focus-visible:border-line-accent focus-visible:outline-none focus-visible:shadow-glow-accent",
          triggerWidth,
          className,
        )}
      >
        <RxSelect.Value placeholder={placeholder} />
        <RxSelect.Icon className="text-text-faint">
          <ChevronDown className="size-3.5" />
        </RxSelect.Icon>
      </RxSelect.Trigger>

      <RxSelect.Portal>
        <RxSelect.Content
          position="popper"
          sideOffset={4}
          className={cn(
            overlaySurface,
            "min-w-[var(--radix-select-trigger-width)]",
            "max-h-[var(--radix-select-content-available-height)]",
            "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          )}
        >
          <RxSelect.ScrollUpButton className="flex h-5 items-center justify-center text-text-faint">
            <ChevronUp className="size-3.5" />
          </RxSelect.ScrollUpButton>

          <RxSelect.Viewport className="p-1">
            {options?.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                icon={option.icon}
              >
                {option.label}
              </SelectItem>
            ))}
            {children}
          </RxSelect.Viewport>

          <RxSelect.ScrollDownButton className="flex h-5 items-center justify-center text-text-faint">
            <ChevronDown className="size-3.5" />
          </RxSelect.ScrollDownButton>
        </RxSelect.Content>
      </RxSelect.Portal>
    </RxSelect.Root>
  );
}

export interface SelectItemProps
  extends ComponentProps<typeof RxSelect.Item> {
  icon?: ReactNode;
}

export function SelectItem({
  className,
  icon,
  children,
  ...props
}: SelectItemProps) {
  return (
    <RxSelect.Item
      className={cn(
        menuItemClasses,
        "data-[state=checked]:text-text",
        className,
      )}
      {...props}
    >
      {icon}
      <RxSelect.ItemText>{children}</RxSelect.ItemText>
      <RxSelect.ItemIndicator className="absolute right-2">
        <Check className="size-3.5" />
      </RxSelect.ItemIndicator>
    </RxSelect.Item>
  );
}

export function SelectGroup({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <RxSelect.Group>
      <RxSelect.Label className="px-2 py-1.5 text-overline text-text-faint">
        {label}
      </RxSelect.Label>
      {children}
    </RxSelect.Group>
  );
}

export function SelectSeparator() {
  return <RxSelect.Separator className="my-1 h-px bg-line-faint" />;
}
