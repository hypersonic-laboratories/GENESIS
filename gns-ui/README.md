# Genesis UI

The interface language for Genesis HELIX packages: React 19, Vite, Tailwind v4,
Radix primitives and Lucide icons, built to look like it belongs to the HELIX
client rather than sitting on top of it.

## Layout

```text
gns-ui/                        Bun workspace root (not a HELIX package)
  packages/
    ui/          @gns/ui       components, theme tokens, self-hosted fonts
    helix/       @gns/helix    Lua bridge: events, visibility, logging
    catalogue/   @gns/catalogue browser workbench for building components
    harness/     @gns/harness  the WebUI shipped by the gns-ui-harness package
  _legacy/                     the previous web-component library, archived
```

`packages/harness` builds into `../gns-ui-harness/html/build/`. The HELIX package
itself stays exactly what it was: a `client.lua` plus a `package.json` manifest.
Generated output is never edited by hand.

## Commands

Bun is the package manager and task runner; `bun.lock` is the lockfile and is
committed. Vite, Tailwind and `tsc` all run unchanged underneath it — nothing
in the build depends on Bun's runtime, so switching back would only mean
rewriting these six scripts.

```bash
bun install
```

```bash
bun run dev
```

Opens the catalogue on <http://localhost:5180>. Component edits hot-reload —
`@gns/ui` is consumed as TypeScript source through the workspace link, so there
is no library build step in the loop.

```bash
bun run watch:harness
```

Rebuilds the in-game bundle on every save. Reload the WebUI in HELIX to pick it
up. Use `bun run build:harness` for a one-off build.

```bash
bun run typecheck
```

## Design

The client is achromatic: a near-black canvas, surfaces made from low-alpha
white, hairline borders, 4px corners, and uppercase type throughout. White is
the action colour — the primary button is white on black, exactly as in the
client's own chrome. Colour appears only when it carries meaning, and each hue
keeps that meaning across every screen.

Two typefaces. **Tomorrow** carries interface text, as it does in the client
itself; **Oxanium** carries the three headline steps. The split lives entirely
in `--font-sans` and `--font-display`: `text-display`, `text-title` and
`text-heading` are utilities that bring the display family with them, so no
component has to ask for it by hand.

Buttons and chips carry the client's clipped bottom-right corner. `corner-shape`
would express it directly but needs Chrome 139, so the `chamfer` utility cuts it
with `clip-path` and redraws the missing border segment with a rotated hairline.

Where this departs from the client is depth. A flat alpha fill reads as a dead
rectangle once it sits over a live 3D scene, so every raised surface gets three
cheap cues: a top-lit gradient, a 1px inset highlight along its upper edge, and
a shadow that separates it from whatever renders behind it. The `surface-*`
utilities in `packages/ui/src/styles/theme.css` bundle that combination.

**Panels carry their own dark fill.** The surface that touches the game cannot
be built from low-alpha white: over bright terrain it simply vanishes. Use
`--color-panel` (or `tone="glass"`, which applies it) for any shell resting on
the world, and reserve the `--color-surface` ramp for elements sitting *inside*
one, where the panel is their backdrop.

Every token lives in that one file, emitted as CSS custom properties under
`@theme static` so screens can reach them from hand-written CSS as well as from
utilities.

## Using it in another package

1. Add a workspace under `packages/` with its own `vite.config.ts`, pointing
   `build.outDir` at `../../../<your-package>/html/build`.
2. In its CSS entry:

   ```css
   @import "tailwindcss";
   @import "@gns/ui/fonts.css";
   @import "@gns/ui/theme.css";

   @source "../src";
   @source "../../ui/src";
   ```

   The second `@source` is required: Tailwind only generates the utilities it
   can see, and the library's class names live outside the app's own tree.

3. Wrap the root in `VisibilityProvider` from `@gns/helix`, then `TooltipProvider`
   and `ToastProvider` from `@gns/ui`.
4. Keep the page transparent. `html`, `body` and `#root` must paint nothing — a
   background there blacks out the player's viewport.

## The client boundary

`@gns/ui` owns presentation, focus, keyboard behaviour, and every component's
empty, loading and disabled state. It does not know HELIX exists.

`@gns/helix` owns the transport, and nothing above it: `emit`, `request`,
`useHelixEvent`, `VisibilityProvider`, `log`.

The consuming package owns everything else — screen composition, live data,
permissions, economy rules, validation, and the HELIX event names themselves.
If a behaviour is useful to every package and independent of gameplay, it
belongs in the library. If it knows about a job, an item or a server event, it
belongs to the package.

## Runtime notes

The client runs CEF 128, so the modern platform is available: `oklch`, `:has()`,
container queries, `color-mix()` and `backdrop-filter` all work. Two constraints
remain:

- **Fonts are bundled.** No CDN request is made at runtime; both families ship
  as latin-subset woff2 inside the build, and only in the weights the system
  uses. Adding a weight to a component means adding its import to
  `packages/ui/src/styles/fonts.css`, or the browser will synthesise it.
- **`backdrop-filter` cannot blur the game.** It blurs what sits behind an
  element *within the document*, and the scene is composited beneath the entire
  page. Use it only where the thing being blurred is page content — a modal
  scrim over the screen underneath. Everywhere else it costs a compositing pass
  and buys nothing.

Overlays use a fixed layer scale so two packages never fight over stacking
order: modals and drawers `1300`, popovers and menus `1400`, toasts `1500`,
tooltips `1600`.

## Verification

`packages/harness` is the in-game proof. It exercises the things that can break
inside CEF but not in a browser: portalled overlays, backdrop filters, custom
properties, pointer capture, and the `hEvent` round trip. Press <kbd>F10</kbd>
in game to open it.
