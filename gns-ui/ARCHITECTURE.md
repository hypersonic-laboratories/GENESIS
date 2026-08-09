# Genesis UI Architecture

## The model

Genesis Shadow Glass is one design system distributed to many autonomous HELIX resources.

```text
gns-ui/src/                         canonical components, tokens, behavior
        |
        | npm.cmd run build
        v
gns-ui/dist/                        versioned compiled distribution
        |
        | npm.cmd run sync
        v
<resource>/html/vendor/genesis-ui/  package-local generated snapshot
        |
        | plain HTML + DOM events
        v
<resource>/html/*                   resource-owned screen composition and bridge
```

`gns-ui` is the source of truth. Resources consume it; they do not copy component source and evolve it independently. A component change propagates to every registered resource when a maintainer deliberately runs the sync workflow and commits the resulting generated copies.

## Why package-local snapshots

HELIX WebUIs are most reliable when their runtime files are package-local. Each consumer therefore loads its own approved snapshot rather than reaching across packages or downloading assets at runtime.

This gives us:

- consistent components across independently authored scripts;
- offline and package-local runtime assets;
- explicit, reviewable upgrades instead of surprise live changes;
- the ability to test a new library build in HELIX before broad adoption;
- straightforward rollback through Git.

It also means propagation is controlled, not instantaneous. Editing `gns-ui/src/` alone does not mutate deployed resources. `npm.cmd run sync` is the promotion step.

## Ownership boundary

The library owns:

- design tokens, typography, spacing, borders, states, and rendering profiles;
- component markup, accessibility, focus, keyboard behavior, and generic interaction;
- the `sg-*` public attributes, properties, slots, and DOM events;
- default icons, fonts, styles, and compatibility behavior.

The consuming resource owns:

- screen layout and which components appear together;
- live data, permissions, validation, inventory/economy rules, and persistence;
- Lua/JavaScript bridges and HELIX event names;
- resource-specific imagery and approved token overrides;
- when its WebUI opens, closes, receives focus, and releases input.

If a behavior is useful to every resource and is independent of gameplay rules, it probably belongs in `gns-ui`. If it knows about a job, item, permission, database record, or server event, it belongs in the consumer.

## Distribution and synchronization

`gns-ui/consumers.json` is the authoritative list of resources managed by the sync workflow. Each entry is a package directory name under the repository's `scripts/` root.

```json
{
  "consumers": [
    "gns-ui-harness",
    "gns-inventory",
    "gns-hud"
  ]
}
```

Running `npm.cmd run sync`:

1. builds `gns-ui/dist/` from canonical source;
2. validates every registered package name and directory;
3. replaces only that package's `html/vendor/genesis-ui/` directory;
4. leaves resource-owned HTML, JavaScript, Lua, data, and assets untouched.

Running `npm.cmd run sync:check` performs a read-only byte comparison and reports `DRIFT` if a registered consumer is stale or locally modified.

## Change lifecycle

1. Change the component or token in `gns-ui/src/`.
2. Update its types, catalogue entry, examples, tests, and changelog when the public contract changes.
3. Run `npm.cmd run check` and `npm.cmd run verify:dist`.
4. Inspect the component in the catalogue and the package-local HELIX harness.
5. Run `npm.cmd run sync`.
6. Review generated diffs in every affected consumer.
7. Smoke-test the affected screens in HELIX.
8. Commit the source change and synchronized snapshots together.

Consumers may temporarily remain on an older snapshot when an upgrade needs migration work. That exception must be explicit in the pull request; it must not be achieved by hand-editing generated vendor files.
