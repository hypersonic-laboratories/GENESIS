---
total_score: 28
na_heuristics: 
max_score: 40
p0_count: 0
target: AI-generated UI indicators and curation improvements
p1_count: 2
timestamp: 2026-08-09T05-00-46Z
slug: catalogue-index-html
---
# Genesis Shadow Glass Catalogue Critique

Method: dual-agent (A: `/root/assessment_a` · B: `/root/assessment_b`)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3 | Profile toggles and event output respond, but navigation current-state is stale and many specimens are silent. |
| 2 | Match System / Real World | 4 | HELIX, inventory, loadout, status, keybind, and script-owned language match the collaborator domain. |
| 3 | User Control and Freedom | 3 | Reversible profiles and dismissal exist; there is no reset-all or local recovery pattern. |
| 4 | Consistency and Standards | 4 | Typography, spacing, state color, component anatomy, and interaction styling are cohesive. |
| 5 | Error Prevention | 2 | Destructive examples are shown without confirmation or a guardrail pattern. |
| 6 | Recognition Rather Than Recall | 3 | Labels are strong, but component contracts are not adjacent to specimens and mobile navigation hides choices. |
| 7 | Flexibility and Efficiency | 2 | No search, filter, copy action, component deep-link, or event/API lookup. |
| 8 | Aesthetic and Minimalist Design | 3 | Disciplined presentation, weakened by a long and repetitive fully expanded catalogue. |
| 9 | Error Recovery | 2 | Error text asks users to retry without providing a retry action or diagnostic context. |
| 10 | Help and Documentation | 2 | One integration snippet exists; component-level attributes, events, states, and examples are absent. |
| **Total** | | **28/40** | **Good visual foundation; substantial catalogue and integration-workflow improvements remain.** |

## Design Specificity Verdict

The Shadow Glass visual language is strongly authored and product-specific. The blue-black material hierarchy, restrained state lighting, Genesis lockup, gameplay-native status and inventory data, keybind language, and Exo 2/Inter roles would not transfer unchanged to an unrelated SaaS product.

The catalogue architecture is far less specific. A fixed rail, a hero-like introduction, a large showcase composition, and a long series of repeated two-column specimen sections are conventional design-system patterns. This structural sameness is the largest AI-generated signal: the page looks like a polished image of a UI kit rather than a tool a Genesis collaborator would actually use to find, understand, copy, and wire a component.

The deterministic markup scan returned zero findings for `catalogue/index.html`. That supports the conclusion that the problem is not low-level mechanical slop. Browser evidence also showed correct rendering, representative DOM events, semantic landmarks, pressed and disabled states, and no console warnings. No live detector overlay was available because the browser evaluation surface rejected DOM mutation; source verification, screenshots, DOM snapshots, and interaction checks were used instead.

## Overall Impression

The interface already has a credible Genesis identity. The largest opportunity is to curate the catalogue around collaborator work rather than visual completeness. It currently proves that the components look good; it should prove that a developer can select one, understand every contract, wire it, test edge cases, and ship it.

## What's Working

1. **A real visual point of view.** The asymmetric mark, tonal blue-black fields, fine steel edges, technical typography, and state-limited glow avoid generic rainbow cyberpunk.
2. **Composition before abstraction.** The Operational Readout demonstrates components working together in a believable game UI, not merely isolated atoms.
3. **Strong semantic foundation.** Color meaning, labelled icons, focus visibility, button roles, pressed/disabled states, landmarks, and live output are consistently handled.

## Priority Issues

### P1 — The catalogue proves appearance, not integration readiness

Collaborators need browser-native contracts, but only the final section contains one incomplete snippet. Put a compact contract beside every specimen: markup, attributes/properties, events and payloads, states, supported CSS variables/parts, minimum size, overflow behavior, and a copy action.

Suggested commands: `$impeccable clarify`, `$impeccable layout`.

### P1 — Interactive-looking specimens are often silent

The overview's Use item control writes to the event output, while specimen actions such as Confirm loadout appear operational but give no feedback. That resembles a generated mockup rather than maintained developer tooling. Either label specimens as visual-only or route every interaction into a local event inspector adjacent to the active specimen.

Suggested command: `$impeccable harden`.

### P2 — The page uses a uniform generated-document rhythm

The repeated overline, heading, description, and specimen-stage formula is polished but predictable. Use overlines more selectively, vary section topology by content, and introduce domain-native structures: contract tables, state machines, event streams, copyable code panes, performance readouts, and live property controls.

Suggested commands: `$impeccable layout`, `$impeccable distill`.

### P2 — Navigation and progressive disclosure are weak

Seven top-level destinations are exposed at once; all component states remain expanded in a very long page. The active rail state stays on Overview after anchor navigation, and mobile hides destinations in a horizontally scrolling strip. Add search, task-based entry paths, scrollspy, component deep-links, and focused component detail views.

Suggested commands: `$impeccable adapt`, `$impeccable distill`.

### P2 — Synthetic details reduce trust

The placeholder G mark, hard-coded server date, illustrative values, generic Lucide glyphs, and vague Runtime ready label make the surface feel generated. Use the real licensed Genesis mark when available, deliberately authored example datasets, a curated icon subset, and precise runtime language such as Components registered until real HELIX validation exists.

Suggested commands: `$impeccable clarify`, `$impeccable delight`.

## Cognitive Load

Four checklist failures indicate high catalogue-level load despite excellent visual grouping: no single primary task in the first viewport, seven navigation choices, state matrices with six to eight interactive-looking items, and no progressive disclosure. The page asks users to browse, evaluate, test profiles, inspect states, and understand integration simultaneously.

The correct reduction is not removing useful component states. It is sequencing them: browse components, open a component, inspect its states and contract, then copy or test it.

## Persona Red Flags

**Alex, power user:** No search, filter, copy action, component deep-link, or direct event/API lookup. Long scrolling replaces fast retrieval, and silent specimen controls force source inspection.

**Sam, keyboard and low-vision user:** The stale `aria-current` announces the wrong location; there is no skip link; compact navigation hides destinations at mobile/high zoom; 11px metadata and 32–40px controls are fragile in embedded rendering.

**Rafa, Genesis HELIX package integrator:** Only one component has inline integration code. Event payloads, customization hooks, minimum geometry, overflow contracts, and HELIX validation status are not documented per component. Runtime ready overstates what has been proven.

## Minor Observations

- Use a real Genesis logo asset when its master and distribution rights are confirmed; the current typographic G is visibly placeholder-like.
- Raw Lucide icons are coherent but generic. Curate names, containers, stroke behavior, and the handful of symbols that become Genesis signatures.
- Increase routine metadata from 11px toward 12–13px and preserve contrast under the actual Unreal scene.
- Destructive examples should demonstrate confirmation, consequence, cancellation, and recovery.
- The final integration snippet needs an explicit note that `hEvent` is consumer-owned and illustrative.
- Vary the catalogue's pacing: a full-width live composition, a dense contract table, a quiet code section, and a focused state inspector should not share one template.

## Questions to Consider

- Is catalogue success that collaborators admire Shadow Glass, or that they wire their first component in under five minutes?
- What if every component page were a self-contained contract: live preview, properties, events, states, edge cases, and copy action?
- Could the catalogue itself become a Genesis operations console with a live event stream and component inspector?
- Which visual signatures should remain recognizable if the cyan glow and Genesis logo are both removed?
