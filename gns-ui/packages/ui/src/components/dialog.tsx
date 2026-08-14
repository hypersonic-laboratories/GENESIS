import type { ComponentProps, ReactNode } from "react";
import { Dialog as RxDialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { IconButton } from "./button";

/**
 * The scrim. One blurred plane per screen — nested surfaces use tone, never a
 * second backdrop filter, because stacking them is expensive inside CEF.
 */
const scrimClasses = [
  "fixed inset-0 z-[1300] bg-ink-950/70 backdrop-blur-[2px]",
  "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
];

export interface ModalProps extends ComponentProps<typeof RxDialog.Root> {}

export function Modal(props: ModalProps) {
  return <RxDialog.Root {...props} />;
}

export const ModalTrigger = RxDialog.Trigger;
export const ModalClose = RxDialog.Close;

export interface ModalContentProps
  extends Omit<ComponentProps<typeof RxDialog.Content>, "title"> {
  title: ReactNode;
  /** Sits under the title; also announced as the dialog description. */
  description?: ReactNode;
  /** Uppercase overline above the title. */
  eyebrow?: ReactNode;
  /** Action row pinned to the bottom. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Hides the corner close button — for decisions that must be answered. */
  hideClose?: boolean;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

/**
 * An interruption that must be resolved before the screen underneath can be
 * used again. Anything that merely runs alongside the screen is a Drawer.
 */
export function ModalContent({
  className,
  title,
  description,
  eyebrow,
  footer,
  size = "md",
  hideClose = false,
  children,
  ...props
}: ModalContentProps) {
  return (
    <RxDialog.Portal>
      <RxDialog.Overlay className={cn(scrimClasses)} />
      <RxDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[1300] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
          modalSizes[size],
          "surface-solid rounded-xl border border-line",
          "inset-shadow-edge shadow-overlay",
          "flex max-h-[calc(100vh-4rem)] flex-col outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line-faint px-5 py-4">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="mb-1 text-overline text-text-subtle">{eyebrow}</p>
            ) : null}
            <RxDialog.Title className="text-heading uppercase text-text">
              {title}
            </RxDialog.Title>
            {description ? (
              <RxDialog.Description className="mt-1 text-caption text-text-subtle">
                {description}
              </RxDialog.Description>
            ) : null}
          </div>
          {!hideClose ? (
            <RxDialog.Close asChild>
              <IconButton
                aria-label="Close"
                variant="ghost"
                size="sm"
                icon={<X />}
              />
            </RxDialog.Close>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer ? (
          <footer className="flex items-center justify-end gap-2 border-t border-line-faint px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </RxDialog.Content>
    </RxDialog.Portal>
  );
}

export interface DrawerProps extends ComponentProps<typeof RxDialog.Root> {}

export function Drawer(props: DrawerProps) {
  return <RxDialog.Root {...props} />;
}

export const DrawerTrigger = RxDialog.Trigger;
export const DrawerClose = RxDialog.Close;

export interface DrawerContentProps
  extends Omit<ComponentProps<typeof RxDialog.Content>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  side?: "left" | "right";
  width?: string;
  hideClose?: boolean;
}

/**
 * A secondary workflow alongside the current screen — filters, details,
 * inspectors. Anchored to an edge and full height.
 */
export function DrawerContent({
  className,
  title,
  description,
  eyebrow,
  footer,
  side = "right",
  width = "w-[min(28rem,90vw)]",
  hideClose = false,
  children,
  ...props
}: DrawerContentProps) {
  return (
    <RxDialog.Portal>
      <RxDialog.Overlay className={cn(scrimClasses)} />
      <RxDialog.Content
        className={cn(
          "fixed inset-y-0 z-[1300] flex flex-col outline-none",
          width,
          side === "right"
            ? "right-0 border-l"
            : "left-0 border-r",
          "surface-solid border-line shadow-overlay",
          side === "right"
            ? "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right"
            : "data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left",
          className,
        )}
        {...props}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line-faint px-5 py-4">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="mb-1 text-overline text-text-subtle">{eyebrow}</p>
            ) : null}
            <RxDialog.Title className="text-heading uppercase text-text">
              {title}
            </RxDialog.Title>
            {description ? (
              <RxDialog.Description className="mt-1 text-caption text-text-subtle">
                {description}
              </RxDialog.Description>
            ) : null}
          </div>
          {!hideClose ? (
            <RxDialog.Close asChild>
              <IconButton
                aria-label="Close"
                variant="ghost"
                size="sm"
                icon={<X />}
              />
            </RxDialog.Close>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer ? (
          <footer className="flex items-center justify-end gap-2 border-t border-line-faint px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </RxDialog.Content>
    </RxDialog.Portal>
  );
}
