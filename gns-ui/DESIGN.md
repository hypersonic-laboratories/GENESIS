---
name: Genesis Shadow Glass UI Library
description: A precise, edge-lit interface language for immersive Genesis roleplay systems.
---

<!-- IMPLEMENTED: Phase 1 tokens, profiles, and representative components are captured in src/ and the compiled catalogue. -->

# Design System: Genesis Shadow Glass

## Overview

**Creative North Star: "The Night Operations Console"**

Shadow Glass should feel like one coherent operating layer placed over a living world: dark enough to preserve the scene, precise enough to scan under pressure, and illuminated only where state or action demands attention. Its glass character comes from layered blue-black surfaces, fine edge definition, controlled transparency, and selective light—not from covering every panel in blur.

The system is designed for dense operational interfaces. Inventory, HUD, prompts, banking, jobs, and administration may assemble the same components differently, but they must share one grammar of typography, state, focus, depth, and feedback. Expression never obscures the task.

`gns-ui` is the implementation source of truth for that grammar. Individual resources compose the system and may use documented customization hooks, but they do not fork component styling. Approved library changes propagate through the registered-consumer sync workflow after validation.

**Key Characteristics:**

- Blue-black layered surfaces rather than pure-black voids.
- Cyan focus and action signals, with semantic color used consistently.
- Fine borders and restrained glows that appear in response to hierarchy or state.
- Condensed futuristic headings paired with highly readable body copy.
- High information density with disciplined spacing and alignment.
- Complete default styling with safe, documented customization points.
- Default, compact, and reduced-effects profiles for embedded runtime constraints.

## Colors

The canonical palette is a restrained blue-black neutral system with one cyan action voice, one blue secondary action role, one violet accent role, and semantic green/amber/red feedback. These values are implemented as public `--sg-color-*` custom properties.

### Primary

- **Signal Cyan** (`#00D4FF`): focus, primary emphasis, active navigation, progress, and selected edges.
- **Action Blue** (`#0090FF`): primary button depth, information states, armor, and supporting action gradients.

### Secondary

- **Genesis Violet** (`#7B5CFF`): gangs, developer/special roles, epic rarity, and deliberately exceptional accents.
- **Success Green** (`#00E676`): successful actions, available/online state, positive amounts, and stamina.
- **Warning Amber** (`#FFB020`): caution, hunger, degraded capacity, and actions requiring attention.
- **Danger Red** (`#FF4D60`): destructive actions, health danger, failure, blocked actions, and critical alerts.

### Neutral

- **Frost Text** (`#E6ECF3`): primary text and high-priority icons.
- **Mist Text** (`#A7B3C2`): secondary text, supporting icons, and captions.
- **Muted Steel** (`#73808F`): disabled and low-emphasis information.
- **Deep Steel** (`#182330`): dark controls, separators, and neutral containers.
- **Night Canvas** (`#0A0F14`): base canvas.
- **Primary Night** (`#08121A`): primary background field.
- **Secondary Night** (`#0E1622`): nested background field.
- **Glass Surface** (`#121B28`): resting component surface.
- **Glass Hover** (`#162231`): hover surface.
- **Glass Active** (`#1C2B3C`): pressed and active surface.
- **Edge Steel** (`#263545`): default border and divider.

**The One Signal Per Meaning Rule.** A semantic color keeps the same meaning across scripts; teams do not recolor success, warning, danger, focus, or rarity for local preference.

**The Canvas Is Never Black Rule.** Use layered blue-black surfaces so borders, depth, and text remain readable without relying on excessive glow.

**The Glow Is State Rule.** Cyan or semantic glow appears for focus, selection, urgency, or exceptional hierarchy—not as a permanent outline on every component.

## Typography

**Display Font:** Exo 2 with a sans-serif fallback  
**Body Font:** Inter with a system-ui fallback  
**Numeric Font:** Exo 2 with tabular figures where supported

Exo 2 supplies the compact, engineered silhouette visible across the references. Inter carries dense body text, labels, and controls without sacrificing readability at small in-game sizes. Both fonts are self-hosted; runtime interfaces do not depend on Google Fonts or another remote service.

### Hierarchy

- **Display** (300, `48px / 56px`, `0.05em`): rare product or major shell title.
- **H1** (600, `32px / 38px`, `0.025em`): primary screen or major modal heading.
- **H2** (600, `24px / 30px`, `0.01em`): section heading.
- **H3** (500, `18px / 24px`, `0.005em`): component group and card heading.
- **Body** (400, `16px / 24px`): instructions, descriptions, and readable content.
- **Caption** (400, `13px / 18px`): metadata and secondary detail.
- **Overline** (600, `11px / 14px`, `0.15em`, uppercase): section labels and taxonomy.
- **Numeric display** (600, `28–32px`): currency, points, and primary measurements.
- **Numeric compact** (500, `16–20px`): counts, percentages, time, and status values.

**The Body Wins Rule.** Exo 2 may establish identity, but Inter owns paragraphs, dense labels, tooltips, menus, and any copy whose comprehension matters more than display character.

**The Number Alignment Rule.** Comparable values use tabular figures and consistent units so changing values do not disturb layout.

## Layout

The system uses a `4px` base increment with an `8px` primary rhythm. The canonical spacing scale is `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px`. Default component gaps are `8–12px`; panel padding is `16px` in compact contexts and `24px` in comfortable contexts.

Reference container widths are `320px` tight, `576px` content, `768px` comfortable, `1024px` wide, and `1440px+` full-width. These are composition guides rather than required page wrappers. Components must remain usable inside package-owned layouts and should not impose a global application grid.

Dense screens organize information by containment, alignment, and repeated anatomy. A panel contains one coherent task or status family. Nested cards use tonal contrast before additional borders. Persistent HUD regions are shallow and compact; opened menus may use deeper surfaces and more generous spacing.

Responsive behavior preserves hierarchy before density. Controls remain operable, important values do not truncate silently, and nonessential metadata yields before primary actions. Screen-level breakpoints will be established by consuming scripts; components expose compact modes and intrinsic sizing rather than assuming viewport routes.

**The Component Owns Its Minimum Rule.** Every component documents its safe minimum size and overflow behavior; consuming scripts own its placement and available width.

**The Eight-Pixel Rhythm Rule.** Four-pixel adjustments may refine icon or text alignment, but primary layout gaps and padding land on the eight-pixel rhythm.

## Elevation & Depth

Shadow Glass uses a hybrid of tonal layering, fine borders, soft dark shadows, and selective colored glow. Resting surfaces are primarily separated through tone. Lift and glow appear only when the interaction or hierarchy needs them.

The shadow vocabulary is flat at rest and overlay when interruption requires lift. The implemented overlay shadow is `0 18px 64px rgb(0 0 0 / 52%)`. The cyan focus ring uses a dark separation ring followed by a two-pixel cyan ring; the optional state glow is `0 0 24px rgb(0 212 255 / 22%)`. Generated reference-board values remain directional rather than production proof.

Transient surfaces follow a fixed layer scale: general overlays `1200`, modals and drawers `1300`, popovers `1400`, toast regions `1500`, and tooltips `1600`. Consumers must not improvise competing local layer values inside the same WebUI document.

Backdrop blur is reserved for large transient overlays, drawers, and modals. The working range is `16–24px` with restrained saturation and texture. Persistent HUD surfaces use opaque or near-opaque blue-black fills so idle compositing cost remains bounded.

**The Flat-at-Rest Rule.** Ordinary cards rest quietly. Hover may lift the border and shadow; focus may add a cyan ring; selection may add tint and a state marker.

**The One Blur Plane Rule.** A composition should not stack multiple large blurred planes. Nested components use tonal surfaces, not nested backdrop filters.

## Shapes

The form language is rectilinear with softened corners: technical, compact, and never toy-like. The canonical radius scale is `4, 8, 12, 16, 20, 24, 32px`, plus a full pill/circle value. Small controls use `8px`; cards use `12px`; modal and drawer shells use `16px`; larger radii are reserved for prominent modules, avatar containers, meters, and explicitly circular controls.

Borders are normally one pixel. Dashed borders communicate empty or drop-target states. Strong two-pixel treatments are reserved for focused, selected, or high-priority states where a single pixel cannot provide sufficient distinction.

**The Radius Follows Scale Rule.** A component does not become friendlier by rounding it more. Radius increases only with the physical scale or circular nature of the component.

## Components

The library provides components rather than finished applications. Every public element uses the `sg-` prefix and exposes standard attributes, properties, slots, CSS variables/parts, and typed DOM events. Components own presentation, focus, keyboard behavior, loading/empty/disabled states, and cleanup. Scripts own data, gameplay rules, server validation, and HELIX event names.

### Buttons

- **Shape:** compact softened rectangle, normally `8px` radius.
- **Primary:** cyan-to-blue action surface with Frost Text; reserved for the leading action in a local context.
- **Secondary:** dark glass surface with cyan border or text emphasis.
- **Tertiary/Ghost:** tonal or transparent surface for low-priority actions.
- **Semantic:** success, warning, and danger variants preserve their meaning.
- **States:** default, hover, focus-visible, active, loading, and disabled are visually distinct without depending only on glow.

### Chips and badges

- Pills communicate filters, short categories, roles, rarity, or compact states.
- Filled chips are selected or high-emphasis; outline chips are resting or secondary.
- Removable chips expose an explicit remove target rather than making the whole chip ambiguous.
- Badges remain readable without glow and do not become miniature buttons unless interactive semantics are present.

### Cards and containers

- Cards use a Glass Surface fill, Edge Steel border, and `12px` radius by default.
- Hover changes the surface and edge; selection adds cyan emphasis and a state marker; warning/error states use semantic edges and tint.
- Cards do not invent navigation or action behavior. Clickability must be explicit in semantics and focus treatment.

### Inputs and fields

- Inputs use dark surfaces, one-pixel borders, `8px` radius, and persistent readable labels where context requires them.
- Focus uses Signal Cyan; success, warning, and error use their semantic roles.
- Disabled fields reduce contrast but retain readable content and an unmistakable noninteractive state.
- Validation never relies only on border color; text or an icon communicates the reason.

### Feedback and overlays

- Toasts are transient and compact; alert banners carry persistent contextual information.
- Modals require user resolution; drawers support secondary workflows without replacing the underlying screen.
- Tooltips clarify a control; popovers contain structured information or actions.
- Loading skeletons preserve component geometry and do not shimmer in reduced-effects mode.

### HUD and status

- Persistent HUD components use compact spacing, minimal blur, and targeted updates.
- Health, armor, hunger, thirst, stress, stamina, oxygen, voice, money, reputation, location, and alert components share anatomy but retain semantic colors.
- Status color thresholds are product logic supplied by the consuming script; the component renders the supplied state.

### Inventory and interaction

- Item slots cover empty, default, hover, focus, selected, disabled, locked, stacked, rarity, out-of-stock, cooldown, and drag states where applicable.
- Item imagery is caller-supplied and contained without becoming the source of component geometry.
- Drag visuals and context actions emit events; they do not decide whether an item may be used, moved, split, dropped, or purchased.
- Prompts, keybind chips, hold actions, distance badges, and target cards expose familiar input affordances while leaving actual bindings and gamepad mapping to the script.

Radial menus, complete equipment composition, full profile screens, and application templates are deferred until the first stable component release has proven its foundations.

## Do's and Don'ts

### Do:

- **Do** begin with the complete Genesis defaults and customize only through supported assets, semantic tokens, profiles, slots, and parts.
- **Do** preserve semantic color meaning across every script.
- **Do** use tonal hierarchy before adding more border, glow, or blur.
- **Do** keep body text and dense controls in Inter and reserve Exo 2 for hierarchy and numbers.
- **Do** provide every applicable state, including focus-visible, loading, empty, disabled, and error.
- **Do** validate the default, compact, and reduced-effects profiles inside HELIX WebUI.
- **Do** compose multiple components inside a small number of script-owned WebUI roots.
- **Do** make shared visual and interaction improvements in `gns-ui`, then synchronize registered consumers.

### Don't:

- **Don't** treat the generated boards as individually authoritative when their values conflict; use the canonical specification.
- **Don't** load fonts, frameworks, icons, or essential assets from a CDN at runtime.
- **Don't** use pure black as the primary canvas or place strong cyan glow around every surface.
- **Don't** stack backdrop filters across nested panels.
- **Don't** bake HELIX, QBCore, banking, inventory, permission, or gameplay event names into public components.
- **Don't** make custom styling necessary to obtain a finished Genesis interface.
- **Don't** redistribute depicted logos, portraits, maps, item imagery, or other assets until their source and license are confirmed.
- **Don't** edit generated `html/vendor/genesis-ui/` snapshots or copy component CSS into a resource-local fork.
