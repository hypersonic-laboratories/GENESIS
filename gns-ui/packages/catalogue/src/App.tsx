import { useState } from "react";
import {
  Badge,
  Segmented,
  ToastProvider,
  TooltipProvider,
  cn,
} from "@gns/ui";
import { Layers, MousePointerClick, Palette, Square } from "lucide-react";
import { Foundations } from "./sections/foundations";
import { Controls } from "./sections/controls";
import { Surfaces } from "./sections/surfaces";
import { Overlays } from "./sections/overlays";

const NAV = [
  { id: "foundations", label: "Foundations", icon: Palette },
  { id: "controls", label: "Controls", icon: MousePointerClick },
  { id: "surfaces", label: "Surfaces & data", icon: Square },
  { id: "overlays", label: "Overlays", icon: Layers },
];

/**
 * Stand-in for the game behind a WebUI. Every surface in this library is
 * translucent by default, and a flat backdrop hides exactly the contrast
 * problems the client will expose — so the catalogue defaults to the busy one.
 */
function SceneBackdrop({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,#1b2430_0%,#0a0a0b_55%)]" />
      <div className="absolute left-[8%] top-[12%] size-[38rem] rounded-full bg-[#2a4d6b]/35 blur-3xl" />
      <div className="absolute right-[4%] top-[38%] size-[30rem] rounded-full bg-[#6b4a2a]/25 blur-3xl" />
      <div className="absolute bottom-[6%] left-[38%] size-[26rem] rounded-full bg-[#3a2a6b]/30 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink-950 to-transparent" />
    </div>
  );
}

export function App() {
  const [backdrop, setBackdrop] = useState("scene");
  const [active, setActive] = useState("foundations");

  return (
    <TooltipProvider>
      <ToastProvider>
        <SceneBackdrop active={backdrop === "scene"} />

        <div className="grain min-h-screen">
          <div className="mx-auto flex max-w-[1400px] gap-10 px-6">
            <aside className="sticky top-0 hidden h-screen w-52 shrink-0 flex-col py-8 lg:flex">
              <div className="mb-8">
                <p className="text-heading uppercase leading-none text-text">
                  Genesis
                </p>
                <p className="text-heading uppercase leading-none text-text-faint">
                  UI
                </p>
                <Badge tone="neutral" size="sm" className="mt-3">
                  v0.1.0
                </Badge>
              </div>

              <nav className="flex flex-col gap-0.5">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;

                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActive(item.id)}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2",
                        "text-control uppercase transition-colors duration-100",
                        isActive
                          ? "bg-surface-active text-text inset-shadow-edge"
                          : "text-text-subtle hover:bg-surface hover:text-text-muted",
                      )}
                    >
                      {isActive ? (
                        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent" />
                      ) : null}
                      <Icon className="size-3.5 shrink-0" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-2">
                <span className="text-micro uppercase text-text-disabled">
                  Backdrop
                </span>
                <Segmented
                  aria-label="Backdrop"
                  size="sm"
                  stretch
                  value={backdrop}
                  onValueChange={setBackdrop}
                  options={[
                    { value: "scene", label: "Scene" },
                    { value: "flat", label: "Flat" },
                  ]}
                />
              </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col gap-20 py-10">
              <header>
                <p className="text-overline text-text-subtle">
                  HELIX WebUI design system
                </p>
                <h1 className="mt-2 text-display uppercase text-text">
                  Genesis UI
                </h1>
                <p className="mt-3 max-w-prose text-body text-text-subtle">
                  One interface language for every HELIX package: the client's
                  own achromatic vocabulary, given the depth a flat overlay
                  loses once it sits on a live scene.
                </p>
              </header>

              <Foundations />
              <Controls />
              <Surfaces />
              <Overlays />

              <footer className="border-t border-line-faint py-8 text-caption text-text-disabled">
                Components own presentation and interaction. Data, permissions
                and HELIX event names stay with the consuming package.
              </footer>
            </main>
          </div>
        </div>
      </ToastProvider>
    </TooltipProvider>
  );
}
