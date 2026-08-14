import type { ComponentProps, ReactNode } from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "../lib/cn";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center",
    "font-sans uppercase whitespace-nowrap",
    "rounded-md border border-transparent",
    "transition-[background-color,border-color,box-shadow,color,opacity] duration-100 ease-snap",
    // A one-pixel drop on press reads as physical without costing a repaint
    // of anything but this element.
    "active:translate-y-px",
    // `pointer-events-none` would be simpler, but it also suppresses the
    // cursor — the pointer would keep showing the page arrow instead of
    // saying the control is unavailable. A native `disabled` button already
    // swallows clicks; the `not-disabled:` guards above keep hover quiet.
    "cursor-pointer disabled:cursor-not-allowed",
    "disabled:opacity-40 disabled:drop-shadow-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** The single leading action in a context. White, as in the client. */
        primary: [
          "bg-accent text-on-accent",
          "bg-linear-to-b from-white to-[#e4e7ea]",
          "drop-shadow-raised",
          "hover:to-white",
          "active:from-[#e4e7ea] active:to-[#d8dbde] active:drop-shadow-flush",
        ],
        /** Default action. A glass chip that holds its edge over the scene. */
        secondary: [
          "surface-raised border-line text-text",
          "inset-shadow-edge drop-shadow-flush",
          "[--chamfer-edge:var(--color-line)]",
          "hover:bg-surface-hover not-disabled:hover:border-line-strong",
          "hover:[--chamfer-edge:var(--color-line-strong)]",
          "active:bg-surface-active active:inset-shadow-well active:drop-shadow-none",
        ],
        /** Low-priority action. No chrome until it is pointed at. */
        ghost: [
          "text-text-muted",
          "hover:bg-surface not-disabled:hover:text-text",
          "active:bg-surface-active",
        ],
        /** Quiet but always visible — toolbar and row actions. */
        subtle: [
          "bg-surface text-text-muted",
          "hover:bg-surface-hover not-disabled:hover:text-text",
          "active:bg-surface-active",
        ],
        /** Destructive and irreversible. */
        danger: [
          "bg-danger text-white",
          "bg-linear-to-b from-[#ea5257] to-[#d33f44]",
          "inset-shadow-edge-strong drop-shadow-raised",
          "hover:from-[#f06166] not-disabled:hover:to-[#dc474c]",
          "active:from-[#d33f44] active:to-[#c4383d] active:drop-shadow-flush",
        ],
        /** Destructive, but not the loudest thing on screen. */
        "danger-ghost": [
          "text-danger",
          "hover:bg-danger-fill not-disabled:hover:text-danger-hover",
          "active:bg-danger-fill",
        ],
      },
      size: {
        xs: "h-6 gap-1 px-2 text-micro [--chamfer-size:4px] [&_svg]:size-3",
        sm: "h-7 gap-1.5 px-2.5 text-micro [--chamfer-size:5px] [&_svg]:size-3.5",
        md: "h-8 gap-2 px-3 text-control [--chamfer-size:6px] [&_svg]:size-4",
        lg: "h-10 gap-2 px-4 text-control [--chamfer-size:8px] [&_svg]:size-4",
      },
      /** The clipped bottom-right corner. On by default — it is the house style. */
      chamfer: {
        true: "chamfer",
        false: "",
      },
      /** Drops horizontal padding and squares the box for a lone glyph. */
      iconOnly: {
        true: "px-0 aspect-square",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "xs", class: "w-6" },
      { iconOnly: true, size: "sm", class: "w-7" },
      { iconOnly: true, size: "md", class: "w-8" },
      { iconOnly: true, size: "lg", class: "w-10" },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "md",
      iconOnly: false,
      fullWidth: false,
      chamfer: true,
    },
  },
);

export interface ButtonProps
  extends Omit<ComponentProps<"button">, "prefix">,
    VariantProps<typeof buttonVariants> {
  /** Render as the single child element instead of a `<button>`. */
  asChild?: boolean;
  /** Swaps the content for a spinner and blocks interaction. */
  loading?: boolean;
  /** Leading glyph, placed before the label. */
  icon?: ReactNode;
  /** Trailing glyph, placed after the label. */
  iconRight?: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  iconOnly,
  fullWidth,
  chamfer,
  asChild = false,
  loading = false,
  disabled,
  icon,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, iconOnly, fullWidth, chamfer }),
        className,
      )}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="animate-spin" aria-hidden />
      ) : (
        icon
      )}
      {children}
      {!loading && iconRight}
    </Comp>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, "iconOnly"> {
  /** Required: an icon alone gives assistive tech nothing to announce. */
  "aria-label": string;
}

/** A button sized for a single glyph. */
export function IconButton({ className, ...props }: IconButtonProps) {
  return <Button iconOnly className={className} {...props} />;
}
