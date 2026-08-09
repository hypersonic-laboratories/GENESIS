# Genesis Shadow Glass UI Handoff

## Goal

Maintain one canonical, framework-neutral Shadow Glass component library for all Genesis HELIX WebUIs. Resources consume compiled package-local snapshots and retain ownership of their gameplay logic and screen composition.

## Current state

- Package: `gns-ui`
- Version: `0.1.0-alpha.0`
- Public custom elements: 41
- Runtime dependencies: none
- Embedded-runtime format: classic deferred `genesis-ui.helix.js`
- Compatibility target: conservative Chromium 89 behavior, with HELIX in-game validation required
- Proven consumer: `gns-ui-harness`
- Latest completed component batch: gameplay interaction components, including the polished wedge-based radial menu
- Next planned batch: HUD and status compositions

The library catalogue is an interactive workbench. The package-local harness has proven registration, native controls, overlays, data-display components, interaction components, event delivery, transparent-page behavior, and input handling in the current HELIX bleeding-edge client.

## Source-of-truth decision

`gns-ui/src/` owns component implementation and `gns-ui/dist/` is generated. Each consuming resource receives an approved snapshot at `html/vendor/genesis-ui/`. Vendor snapshots are never edited by hand.

`gns-ui/consumers.json` registers every managed consumer. From `gns-ui/`:

```powershell
npm.cmd run sync
npm.cmd run sync:check
```

`sync` builds the canonical library and refreshes every registered consumer. `sync:check` confirms that those copies match the distribution. This is a deliberate promotion boundary: source edits do not silently affect live resources before testing.

## Required workflow for component changes

1. Edit source, styles, types, catalogue records, examples, and tests as appropriate.
2. Run `npm.cmd run check`.
3. Run `npm.cmd run verify:dist`.
4. Inspect the catalogue in a desktop browser.
5. Exercise the affected states and events through `gns-ui-harness` in HELIX.
6. Run `npm.cmd run sync`.
7. Review all generated consumer diffs and smoke-test affected resource screens.
8. Commit the canonical change and synchronized snapshots together.

## Non-negotiable boundaries

- Components expose browser-native attributes, properties, slots, and bubbling/composed DOM events.
- Consumers do not require a frontend framework or package manager.
- The library does not own gameplay data, permissions, economy, persistence, server validation, or HELIX event names.
- Runtime assets remain package-local; no CDN or cross-package path is required.
- Keep HELIX pages transparent and disable pointer interaction while their UI root is closed.
- Avoid Chromium-incompatible APIs and expensive persistent effects.
- Keep defaults complete; customization must be optional and use documented hooks.

## Next work

Build and validate the HUD/status batch:

- vital status;
- status strip;
- player capsule;
- location status;
- caller-supplied server clock;
- minimap frame.

The server remains authoritative. In particular, status values and time are supplied by consumers; library components must not add polling or independent gameplay timers.
