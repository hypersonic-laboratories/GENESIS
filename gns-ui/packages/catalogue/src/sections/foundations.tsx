import { Section, Spec } from "../Showcase";

const surfaces = [
  { name: "canvas", token: "--color-canvas", className: "bg-canvas" },
  { name: "surface", token: "--color-surface", className: "bg-surface" },
  {
    name: "surface-hover",
    token: "--color-surface-hover",
    className: "bg-surface-hover",
  },
  {
    name: "surface-active",
    token: "--color-surface-active",
    className: "bg-surface-active",
  },
  {
    name: "surface-sunken",
    token: "--color-surface-sunken",
    className: "bg-surface-sunken",
  },
];

const signals = [
  { name: "accent", className: "bg-accent" },
  { name: "danger", className: "bg-danger" },
  { name: "warning", className: "bg-warning" },
  { name: "success", className: "bg-success" },
  { name: "info", className: "bg-info" },
  { name: "signal", className: "bg-signal" },
];

const inkRamp = [
  "bg-ink-950",
  "bg-ink-900",
  "bg-ink-850",
  "bg-ink-800",
  "bg-ink-750",
  "bg-ink-700",
  "bg-ink-600",
  "bg-ink-500",
  "bg-ink-400",
  "bg-ink-300",
  "bg-ink-200",
  "bg-ink-100",
  "bg-ink-50",
];

const type = [
  { name: "display", className: "text-display" },
  { name: "title", className: "text-title" },
  { name: "heading", className: "text-heading" },
  { name: "subheading", className: "text-subheading" },
  { name: "body", className: "text-body" },
  { name: "control", className: "text-control" },
  { name: "caption", className: "text-caption" },
  { name: "overline", className: "text-overline" },
  { name: "micro", className: "text-micro" },
];

// Spelled out rather than interpolated — Tailwind only sees complete class
// names in the source, so `rounded-${name}` would compile to nothing.
const radii = [
  { name: "xs", className: "rounded-xs" },
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "xl", className: "rounded-xl" },
  { name: "2xl", className: "rounded-2xl" },
];

const depth = [
  { name: "flush", className: "shadow-flush" },
  { name: "raised", className: "shadow-raised" },
  { name: "lifted", className: "shadow-lifted" },
  { name: "panel", className: "shadow-panel" },
  { name: "overlay", className: "shadow-overlay" },
];

export function Foundations() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description="The tokens every component is assembled from. Screens compose these — they do not invent new values alongside them."
    >
      <Spec
        title="Surfaces"
        note="Translucent fills sit over the world. The opaque ink ramp is for anything that must stay legible regardless of what renders behind it."
        stack
      >
        <div className="flex flex-wrap gap-3">
          {surfaces.map((surface) => (
            <div key={surface.name} className="w-40">
              <div
                className={`h-14 rounded-md border border-line ${surface.className}`}
              />
              <p className="mt-1.5 text-micro uppercase text-text-muted">
                {surface.name}
              </p>
              <p className="text-micro text-text-disabled">{surface.token}</p>
            </div>
          ))}
        </div>

        <div className="flex overflow-hidden rounded-md border border-line">
          {inkRamp.map((step) => (
            <div key={step} className={`h-10 flex-1 ${step}`} />
          ))}
        </div>
      </Spec>

      <Spec
        title="Signals"
        note="White carries action. Colour appears only where it means something, and each hue keeps that meaning across every screen."
      >
        {signals.map((signal) => (
          <div key={signal.name} className="w-28">
            <div
              className={`h-10 rounded-md border border-line-faint ${signal.className}`}
            />
            <p className="mt-1.5 text-micro uppercase text-text-muted">
              {signal.name}
            </p>
          </div>
        ))}
      </Spec>

      <Spec
        title="Type scale"
        note="Tomorrow throughout, as in the client. Each step carries its own weight, leading and tracking, so one class sets a whole role."
        stack
      >
        {type.map((step) => (
          <div key={step.name} className="flex items-baseline gap-6">
            <span className="w-24 shrink-0 text-micro uppercase text-text-disabled">
              {step.name}
            </span>
            <span className={`${step.className} uppercase text-text`}>
              Night operations
            </span>
          </div>
        ))}
      </Spec>

      <Spec
        title="Depth"
        note="Shadow separates a surface from the scene; the inset edge highlight gives it a lit top bevel. Together they stop flat alpha from dissolving into the background."
      >
        {depth.map((level) => (
          <div key={level.name} className="w-32">
            <div
              className={`h-16 rounded-md border border-line surface-raised inset-shadow-edge ${level.className}`}
            />
            <p className="mt-2 text-micro uppercase text-text-muted">
              {level.name}
            </p>
          </div>
        ))}
      </Spec>

      <Spec
        title="Radius"
        note="Tight by design. Anything softer than 8px stops reading as instrumentation."
      >
        {radii.map((radius) => (
          <div key={radius.name} className="w-24">
            <div
              className={`h-16 border border-line surface-raised inset-shadow-edge ${radius.className}`}
            />
            <p className="mt-2 text-micro uppercase text-text-muted">
              {radius.name}
            </p>
          </div>
        ))}
      </Spec>
    </Section>
  );
}
