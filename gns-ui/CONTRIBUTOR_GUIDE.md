# Using Genesis Shadow Glass

This guide is for contributors building a HELIX WebUI inside a Genesis resource.

## What you use

Use the `sg-*` components from `gns-ui` instead of recreating buttons, inputs, panels, prompts, menus, notifications, or status widgets. The component catalogue is the contract explorer: it shows supported attributes, events, states, accessibility notes, and copyable markup.

You do not need React, Vue, Svelte, Node, or npm inside your resource. Consumers load compiled package-local CSS and JavaScript and use normal HTML and DOM events.

## Add Genesis UI to a resource

Ask a library maintainer to add your package directory name to `gns-ui/consumers.json`, then run from `gns-ui/`:

```powershell
npm.cmd run sync
```

Your resource will receive:

```text
your-resource/
└── html/
    └── vendor/
        └── genesis-ui/
            ├── genesis-ui.css
            ├── genesis-ui.helix.js
            ├── genesis-ui.js
            ├── genesis-ui.d.ts
            ├── genesis-ui.manifest.json
            ├── genesis-icons.svg
            └── assets/
```

Load the HELIX-compatible files in your HTML:

```html
<link rel="stylesheet" href="./vendor/genesis-ui/genesis-ui.css">
<script defer src="./vendor/genesis-ui/genesis-ui.helix.js"></script>
```

Keep the page transparent and noninteractive while closed:

```css
html,
body {
    background: transparent;
}

body {
    pointer-events: none;
}

body[data-visible="true"] {
    pointer-events: auto;
}
```

## Compose a component

```html
<sg-interaction-prompt
    id="garage-prompt"
    key="E"
    label="Open garage"
    hint="View stored vehicles"
    icon="car"
></sg-interaction-prompt>
```

Connect its browser event to resource-owned logic:

```js
const prompt = document.querySelector("#garage-prompt");

prompt.addEventListener("sg-activate", () => {
    hEvent("gns-garage:client:open", { garageId: "pillbox" });
});
```

The component owns how the prompt looks, focuses, and activates. Your resource owns whether the player may use the garage, which garage is active, and what the server does.

## Customize safely

The defaults are intended to be complete. Prefer component attributes, caller-owned slots, rendering profiles, and documented `--sg-*` tokens. Supply resource imagery through the supported content slots.

Avoid copying component CSS into your resource. Avoid targeting undocumented internal classes. Those approaches create a fork that will not inherit future fixes reliably.

If several resources need the same change, propose it in `gns-ui`. If only one screen needs different composition or data, keep that work in the resource.

## Receive library updates

Library updates are not downloaded at runtime. A maintainer tests the new build and runs:

```powershell
npm.cmd run sync
npm.cmd run sync:check
```

That refreshes the generated vendor snapshot in every registered resource. Review the manifest version and affected UI states, smoke-test in HELIX, and commit the generated changes. Never edit `html/vendor/genesis-ui/` by hand because the next sync replaces it.

## Before opening a pull request

- Use existing catalogue components before creating resource-local controls.
- Keep gameplay and HELIX event names outside the library.
- Add your package to `consumers.json` if it consumes Genesis UI.
- Run `npm.cmd run check`, `npm.cmd run verify:dist`, and `npm.cmd run sync:check` for library changes.
- Test WebUI changes in HELIX, including open/close behavior and input release.
- Say which consumers were synchronized and tested.
- Do not commit credentials or external runtime dependencies.
