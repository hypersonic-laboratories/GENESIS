import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Tabs as RxTabs, ToggleGroup as RxToggleGroup } from "radix-ui";
import { cn } from "../lib/cn";

export interface TabsProps extends ComponentProps<typeof RxTabs.Root> {}

export function Tabs({ className, ...props }: TabsProps) {
  return <RxTabs.Root className={cn("flex flex-col", className)} {...props} />;
}

export interface TabListProps extends ComponentProps<typeof RxTabs.List> {
  /** Content pinned to the right of the bar — keybind hints, counters. */
  aside?: ReactNode;
}

export function TabList({ className, aside, children, ...props }: TabListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(
    null,
  );

  /*
   * One marker that travels, rather than a rule per tab fading in and out.
   * The list does not know which tab is selected — Radix owns that — so the
   * position is read back off whichever trigger carries `data-state="active"`,
   * and a MutationObserver catches the swap without the two needing to talk.
   */
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"]');
      setMarker(
        active ? { left: active.offsetLeft, width: active.offsetWidth } : null,
      );
    };

    update();

    const attributes = new MutationObserver(update);
    attributes.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });

    // Reflow moves the tabs without changing any attribute.
    const resize = new ResizeObserver(update);
    resize.observe(list);

    return () => {
      attributes.disconnect();
      resize.disconnect();
    };
  }, []);

  return (
    <div className="flex items-stretch justify-between gap-4 border-b border-line">
      <RxTabs.List
        ref={listRef}
        className={cn("relative flex items-stretch gap-1", className)}
        {...props}
      >
        {children}
        <span
          aria-hidden
          style={
            marker
              ? { left: marker.left, width: marker.width, opacity: 1 }
              : { opacity: 0 }
          }
          className={cn(
            "pointer-events-none absolute -bottom-px h-0.5 rounded-xs bg-accent",
            "transition-[left,width,opacity] duration-200 ease-out-quart",
          )}
        />
      </RxTabs.List>
      {aside ? (
        <div className="flex shrink-0 items-center gap-2">{aside}</div>
      ) : null}
    </div>
  );
}

export interface TabProps extends ComponentProps<typeof RxTabs.Trigger> {
  icon?: ReactNode;
}

/**
 * A tab. Selection is drawn by the travelling marker on {@link TabList}, which
 * overlaps the list's own border so the row keeps one continuous baseline.
 */
export function Tab({ className, icon, children, ...props }: TabProps) {
  return (
    <RxTabs.Trigger
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 pb-2.5 pt-2",
        "text-subheading uppercase text-text-subtle",
        "transition-colors duration-150 ease-snap outline-none",
        "hover:text-text-muted",
        "data-[state=active]:text-text",
        "[&_svg]:size-3.5 [&_svg]:shrink-0",
        // The icon leads the label into place on selection.
        "[&_svg]:transition-[translate] [&_svg]:duration-200 [&_svg]:ease-snap",
        "data-[state=active]:[&_svg]:-translate-y-px",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </RxTabs.Trigger>
  );
}

export interface TabPanelProps extends ComponentProps<typeof RxTabs.Content> {}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <RxTabs.Content
      className={cn("outline-none data-[state=active]:animate-fade-in", className)}
      {...props}
    />
  );
}

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
}

export interface SegmentedProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedOption[];
  size?: "sm" | "md";
  className?: string;
  /** Stretches the segments to fill the container evenly. */
  stretch?: boolean;
  "aria-label"?: string;
}

/**
 * A small set of mutually exclusive choices shown side by side. Prefer this
 * over a select when there are two to four options and the labels are short.
 */
export function Segmented({
  value,
  onValueChange,
  options,
  size = "md",
  className,
  stretch = false,
  "aria-label": ariaLabel,
}: SegmentedProps) {
  return (
    <RxToggleGroup.Root
      type="single"
      value={value}
      aria-label={ariaLabel}
      // Radix clears the value when the active item is pressed again; a
      // segmented control must always keep exactly one selection.
      onValueChange={(next) => next && onValueChange(next)}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md p-0.5",
        "surface-well border border-line inset-shadow-well",
        stretch && "flex w-full",
        className,
      )}
    >
      {options.map((option) => (
        <RxToggleGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          aria-label={option["aria-label"]}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-1.5 rounded-sm",
            "uppercase text-text-subtle outline-none",
            "transition-[background-color,color,box-shadow] duration-100 ease-snap",
            size === "sm" ? "h-6 px-2 text-micro" : "h-7 px-3 text-control",
            stretch && "flex-1",
            "hover:text-text-muted",
            "data-[state=on]:bg-surface-active data-[state=on]:text-text",
            "data-[state=on]:inset-shadow-edge data-[state=on]:shadow-flush",
            "disabled:pointer-events-none disabled:opacity-40",
            "[&_svg]:size-3.5 [&_svg]:shrink-0",
          )}
        >
          {option.icon}
          {option.label}
        </RxToggleGroup.Item>
      ))}
    </RxToggleGroup.Root>
  );
}
