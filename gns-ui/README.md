# Genesis Shadow Glass UI

Framework-neutral WebUI components for Genesis HELIX packages. The library is maintained with TypeScript tooling, but consumers use only compiled local files, native HTML, and DOM events.

## Current status

`0.1.0-alpha.0` is the Phase 1 foundation and consumer proof. It establishes the canonical tokens, build and distribution contract, package-local HELIX harness, rendering profiles, and representative components. It is not yet the first stable component release.

Implemented public elements:

- `sg-button`
- `sg-icon-button`
- `sg-input` and `sg-select`
- `sg-toggle` and `sg-slider`
- `sg-tabs` and `sg-segmented`
- `sg-modal`, `sg-drawer`, and `sg-tooltip`
- `sg-toast`
- `sg-panel` and `sg-card`
- `sg-badge`
- `sg-icon`
- `sg-stat`
- `sg-item-slot`
- `sg-alert`
- `sg-keybind`
- `sg-divider`

The local catalogue is an integration workbench rather than a static style guide. It lets collaborators search the component registry, change supported attributes, inspect the exact markup and event contract, copy snippets, and observe emitted `sg-*` DOM events without adding a framework.

## Maintainer workflow

```powershell
npm.cmd install
npm.cmd run check
```

The build creates `dist/` and refreshes `helix-harness/vendor/genesis-ui/`. Both are generated outputs; source files remain canonical.

## Five-minute consumer setup

1. Run the library build or obtain a release archive.
2. Copy `dist/` into the consuming package as `html/vendor/genesis-ui/`.
3. Load the local files from the package HTML. Use the classic HELIX bundle in the embedded runtime:

```html
<link rel="stylesheet" href="./vendor/genesis-ui/genesis-ui.css">
<script defer src="./vendor/genesis-ui/genesis-ui.helix.js"></script>
```

The ESM bundle remains available for ordinary browsers and module-based tooling:

```html
<link rel="stylesheet" href="./vendor/genesis-ui/genesis-ui.css">
<script type="module" src="./vendor/genesis-ui/genesis-ui.js"></script>
```

4. Compose components and connect their DOM events to the script-owned bridge:

```html
<sg-button id="use-item" variant="primary">Use item</sg-button>

<script>
    document.querySelector('#use-item').addEventListener('sg-activate', () => {
        hEvent('inventory:useItem', { itemId: 'medkit' });
    });
</script>
```

`hEvent` and the event name above are examples owned by the consuming script. Genesis UI does not include a HELIX, QBCore, economy, permission, or gameplay bridge.

## Catalogue workflow

Serve the package root with any local static server, then open `catalogue/index.html`. The workbench supports hash-addressable component views and keeps rendering profiles scoped to the preview surface so testing compact or reduced-effects output does not alter the documentation shell.

The catalogue reports browser registration and HELIX validation separately. “Components registered” means the compiled custom elements loaded; “HELIX harness passed” records the successful package-local run in the current bleeding-edge client, not a permanent guarantee for future client builds.

## Rendering profiles

Profiles are opt-in attributes on any common ancestor:

```html
<body data-sg-theme="shadow" data-sg-density="compact" data-sg-effects="reduced">
```

- `data-sg-density="compact"` reduces control height, panel padding, and inventory geometry.
- `data-sg-effects="reduced"` removes decorative glow and blur while preserving state contrast.
- The operating-system `prefers-reduced-motion` setting is respected automatically.

## Asset replacement

Item imagery is caller-owned. Put an `<img>`, SVG, or another visual inside `sg-item-slot`; the component supplies geometry and state treatment. The default icon sprite path resolves relative to `genesis-ui.js`. An individual `sg-icon` can override it with the `src` attribute when required.

The distribution self-hosts Inter and Exo 2 and includes their OFL 1.1 license files. The generated Lucide sprite includes its ISC license.

## Verification boundaries

The automated Phase 1 checks validate TypeScript, reproducible distribution contents, local-only runtime references, file budgets, the manifest, and the minimal consumer. Browser inspection validates component registration, layout, focus, and DOM-event behavior.

The current Chromium target is a conservative Chromium 89 baseline. The package-local harness has rendered successfully in the current HELIX bleeding-edge client; each release still requires an in-game smoke test because the embedded runtime can change independently.
