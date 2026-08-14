import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * tailwind-merge only knows Tailwind's stock scales. Our theme replaces the
 * type scale outright and adds a semantic colour set, so without this config
 * it guesses — `text-overline` is not a t-shirt size, so it gets filed as a
 * colour and silently cancels out `text-muted` on the same element. Teaching
 * it the custom groups keeps conflict resolution honest.
 */

const FONT_SIZES = [
  "display",
  "title",
  "heading",
  "subheading",
  "body",
  "control",
  "caption",
  "overline",
  "micro",
] as const;

const TEXT_COLORS = [
  "text",
  "muted",
  "subtle",
  "faint",
  "disabled",
  "accent",
  "on-accent",
  "danger",
  "warning",
  "success",
  "info",
  "signal",
] as const;

const SURFACE_COLORS = [
  "canvas",
  "canvas-sunken",
  "track",
  "panel",
  "panel-strong",
  "surface",
  "surface-hover",
  "surface-active",
  "surface-sunken",
  "surface-raised",
  "accent",
  "accent-hover",
  "danger",
  "danger-hover",
  "danger-fill",
  "warning",
  "warning-fill",
  "success",
  "success-fill",
  "info",
  "info-fill",
  "signal",
  "signal-fill",
] as const;

const LINE_COLORS = [
  "line",
  "line-faint",
  "line-strong",
  "line-accent",
  "danger",
  "danger-line",
  "warning",
  "warning-line",
  "success",
  "success-line",
  "info",
  "info-line",
  "signal",
  "signal-line",
  "accent",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
      "text-color": [{ text: [...TEXT_COLORS] }],
      "bg-color": [{ bg: [...SURFACE_COLORS] }],
      "border-color": [{ border: [...LINE_COLORS] }],
      shadow: [
        { shadow: ["flush", "raised", "panel", "overlay", "lifted"] },
        { shadow: ["glow-accent", "glow-danger"] },
      ],
      "inset-shadow": [{ "inset-shadow": ["edge", "edge-strong", "well"] }],
      "drop-shadow": [{ "drop-shadow": ["raised", "flush"] }],
      stroke: [{ stroke: ["track", "accent", "line", "line-strong"] }],
    },
  },
});

/** Merge conditional class names, resolving Tailwind conflicts last-wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
