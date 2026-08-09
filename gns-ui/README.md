# Genesis Shadow Glass UI

Framework-neutral WebUI components for Genesis HELIX packages. The library is maintained with TypeScript tooling, but consumers use only compiled local files, native HTML, and DOM events.

## Source of truth

`gns-ui/src/` is the single source of truth for the Genesis interface language. Consuming resources do not fork component code or maintain their own copies by hand. They compose the public `sg-*` elements, provide their own data and assets, and connect the elements' DOM events to resource-owned gameplay logic.

HELIX resources receive a package-local snapshot at `html/vendor/genesis-ui/`. This is deliberate: it keeps every WebUI self-contained and prevents an untested library edit from changing every live screen immediately. When a library update has passed the catalogue, automated checks, and the in-game harness, maintainers run one sync command to refresh every package registered in `consumers.json`:

```powershell
npm.cmd run sync
```

The result is centralized design ownership with controlled propagation. A changed component, such as `sg-interaction-prompt`, reaches all registered consumers after sync. A resource that is not registered, or that intentionally overrides public tokens, will not necessarily match the new default.

## Current status

`0.1.0-alpha.0` is the Phase 1 foundation and consumer proof. It establishes the canonical tokens, build and distribution contract, package-local HELIX harness, rendering profiles, and representative components. It is not yet the first stable component release.

Implemented public elements:

- `sg-button`
- `sg-icon-button`
- `sg-input` and `sg-select`
- `sg-toggle` and `sg-slider`
- `sg-checkbox`, `sg-radio-group`, `sg-textarea`, and `sg-number-stepper`
- `sg-chip`
- `sg-interaction-prompt`, `sg-action-list`, and `sg-confirm-progress`
- `sg-popover`, `sg-context-menu`, and `sg-radial-menu`
- `sg-breadcrumb` and `sg-pagination`
- `sg-progress`, `sg-meter`, and `sg-avatar`
- `sg-list-row`, `sg-empty-state`, `sg-skeleton`, and `sg-data-table`
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

The build creates `dist/` and refreshes the harness fixtures. Generated outputs are never edited directly; source files remain canonical.

After approving a library change:

```powershell
npm.cmd run sync
npm.cmd run sync:check
```

`sync` builds the current library and replaces `html/vendor/genesis-ui/` in every package named in `consumers.json`. `sync:check` is read-only and fails when any registered consumer differs from the current distribution. Review and test the generated consumer diffs before committing them.

## Five-minute consumer setup

1. Add the consuming package name to `gns-ui/consumers.json`.
2. From `gns-ui/`, run `npm.cmd run sync`. Contributors who do not maintain the library may instead obtain an approved release snapshot from a maintainer.
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

Do not edit files inside `html/vendor/genesis-ui/`. Changes there are generated and will be replaced by the next sync. Component fixes belong in `gns-ui/src/`; resource-specific composition and bridge logic belong in the consuming package.

See [CONTRIBUTOR_GUIDE.md](CONTRIBUTOR_GUIDE.md) for the complete adoption and upgrade workflow, [ARCHITECTURE.md](ARCHITECTURE.md) for the ownership boundary, and [HANDOFF.md](HANDOFF.md) for current project state.

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
