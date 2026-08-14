import type { ComponentProps, ReactNode } from "react";
import {
  ContextMenu as RxContextMenu,
  DropdownMenu as RxDropdownMenu,
  Popover as RxPopover,
  Tooltip as RxTooltip,
} from "radix-ui";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { menuItemClasses, overlaySurface } from "./select";
import { Keybind } from "./badge";

/* ----------------------------------------------------------------- Tooltip */

/** Wrap the app once; individual tooltips share its open/close timing. */
export function TooltipProvider({
  delayDuration = 200,
  ...props
}: ComponentProps<typeof RxTooltip.Provider>) {
  return <RxTooltip.Provider delayDuration={delayDuration} {...props} />;
}

export interface TooltipProps {
  /** The control being explained. Must accept a ref. */
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  /** Key cap shown after the label. */
  keybind?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** One short clarifying line for a control. Never put actions in here. */
export function Tooltip({
  children,
  content,
  side = "top",
  keybind,
  open,
  onOpenChange,
}: TooltipProps) {
  return (
    <RxTooltip.Root open={open} onOpenChange={onOpenChange}>
      <RxTooltip.Trigger asChild>{children}</RxTooltip.Trigger>
      <RxTooltip.Portal>
        <RxTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-[1600] flex items-center gap-2 rounded-md border border-line px-2 py-1",
            "surface-solid inset-shadow-edge shadow-lifted",
            "text-caption uppercase text-text-muted",
            "data-[state=delayed-open]:animate-scale-in",
          )}
        >
          {content}
          {keybind ? <Keybind size="sm">{keybind}</Keybind> : null}
          <RxTooltip.Arrow className="fill-ink-850" width={10} height={5} />
        </RxTooltip.Content>
      </RxTooltip.Portal>
    </RxTooltip.Root>
  );
}

/* ----------------------------------------------------------------- Popover */

export const Popover = RxPopover.Root;
export const PopoverTrigger = RxPopover.Trigger;
export const PopoverClose = RxPopover.Close;

export interface PopoverContentProps
  extends Omit<ComponentProps<typeof RxPopover.Content>, "title"> {
  /** Adds a heading row above the content. */
  title?: ReactNode;
}

/** Structured content or actions anchored to a control. */
export function PopoverContent({
  className,
  title,
  children,
  sideOffset = 6,
  ...props
}: PopoverContentProps) {
  return (
    <RxPopover.Portal>
      <RxPopover.Content
        sideOffset={sideOffset}
        className={cn(
          overlaySurface,
          "w-72 p-3 outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      >
        {title ? (
          <p className="mb-2 text-overline text-text-subtle">{title}</p>
        ) : null}
        {children}
        <RxPopover.Arrow className="fill-ink-850" width={10} height={5} />
      </RxPopover.Content>
    </RxPopover.Portal>
  );
}

/* ------------------------------------------------------------------- Menus */

export interface MenuItemProps {
  icon?: ReactNode;
  /** Key cap rendered right-aligned. */
  shortcut?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: (event: Event) => void;
  children: ReactNode;
  className?: string;
}

function renderItemContent({ icon, shortcut, children }: MenuItemProps) {
  return (
    <>
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {shortcut ? <Keybind size="sm">{shortcut}</Keybind> : null}
    </>
  );
}

const dangerItem =
  "text-danger data-[highlighted]:bg-danger-fill data-[highlighted]:text-danger-hover";

export const DropdownMenu = RxDropdownMenu.Root;
export const DropdownMenuTrigger = RxDropdownMenu.Trigger;

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof RxDropdownMenu.Content>) {
  return (
    <RxDropdownMenu.Portal>
      <RxDropdownMenu.Content
        sideOffset={sideOffset}
        className={cn(
          overlaySurface,
          "min-w-44 p-1 outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      />
    </RxDropdownMenu.Portal>
  );
}

export function DropdownMenuItem({ className, danger, ...props }: MenuItemProps) {
  return (
    <RxDropdownMenu.Item
      disabled={props.disabled}
      onSelect={props.onSelect}
      className={cn(menuItemClasses, "pr-2", danger && dangerItem, className)}
    >
      {renderItemContent(props)}
    </RxDropdownMenu.Item>
  );
}

export function DropdownMenuCheckboxItem({
  className,
  checked,
  onCheckedChange,
  children,
  ...props
}: Omit<MenuItemProps, "onSelect"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <RxDropdownMenu.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={props.disabled}
      className={cn(menuItemClasses, className)}
    >
      {props.icon}
      <span className="flex-1 truncate">{children}</span>
      <RxDropdownMenu.ItemIndicator className="absolute right-2">
        <Check className="size-3.5" />
      </RxDropdownMenu.ItemIndicator>
    </RxDropdownMenu.CheckboxItem>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <RxDropdownMenu.Label className="px-2 py-1.5 text-overline text-text-faint">
      {children}
    </RxDropdownMenu.Label>
  );
}

export function DropdownMenuSeparator() {
  return <RxDropdownMenu.Separator className="my-1 h-px bg-line-faint" />;
}

export const ContextMenu = RxContextMenu.Root;
export const ContextMenuTrigger = RxContextMenu.Trigger;

export function ContextMenuContent({
  className,
  ...props
}: ComponentProps<typeof RxContextMenu.Content>) {
  return (
    <RxContextMenu.Portal>
      <RxContextMenu.Content
        className={cn(
          overlaySurface,
          "min-w-44 p-1 outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      />
    </RxContextMenu.Portal>
  );
}

export function ContextMenuItem({ className, danger, ...props }: MenuItemProps) {
  return (
    <RxContextMenu.Item
      disabled={props.disabled}
      onSelect={props.onSelect}
      className={cn(menuItemClasses, "pr-2", danger && dangerItem, className)}
    >
      {renderItemContent(props)}
    </RxContextMenu.Item>
  );
}

export function ContextMenuLabel({ children }: { children: ReactNode }) {
  return (
    <RxContextMenu.Label className="px-2 py-1.5 text-overline text-text-faint">
      {children}
    </RxContextMenu.Label>
  );
}

export function ContextMenuSeparator() {
  return <RxContextMenu.Separator className="my-1 h-px bg-line-faint" />;
}

export function ContextMenuSub({
  label,
  icon,
  children,
}: {
  label: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <RxContextMenu.Sub>
      <RxContextMenu.SubTrigger className={cn(menuItemClasses, "pr-2")}>
        {icon}
        <span className="flex-1 truncate">{label}</span>
        <ChevronRight className="size-3.5" />
      </RxContextMenu.SubTrigger>
      <RxContextMenu.Portal>
        <RxContextMenu.SubContent
          className={cn(overlaySurface, "min-w-40 p-1 outline-none")}
          sideOffset={2}
        >
          {children}
        </RxContextMenu.SubContent>
      </RxContextMenu.Portal>
    </RxContextMenu.Sub>
  );
}
