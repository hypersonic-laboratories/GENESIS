# Contributing to GENESIS

## What this repository is

GENESIS uses QBCore as a **starting point**, not as a dependency we track. We are not maintaining
QBCore, we do not pull upstream changes, and we owe upstream nothing but attribution. The long-term
plan is to replace all of it.

That means every `qb-*` package here is temporary. The naming convention below exists so that at any
moment you can tell what is still borrowed, what we have patched, and what is ours.

## Naming

Three prefixes, three meanings. Never invent a fourth.

| Prefix | Meaning | Status |
|---|---|---|
| `qb-` | Inherited from QBCore Helix, still recognisably upstream | Legacy, being replaced |
| `hl-` | Helix Life project. Dead. | Remove on sight |
| `gns-` | GENESIS. Written or fully reworked by us. | Ours |

`hl-` is dead code from a different project. Never create one. The references that survive in
`qb-houses` are tracked in [UPSTREAM.md](UPSTREAM.md) and are being removed — if you find a new one,
delete it or replace it with a `gns-` implementation, and say which in your PR.

### Package directories

New package, or an old one reworked past recognition: `gns-<name>`, lowercase, hyphens only.

```
gns-heists/
gns-reputation/
```

### The lifecycle of a borrowed package

A package moves through three states, and only moves forward:

1. **Vanilla** — `qb-thing/`, untouched. Don't edit it casually.
2. **Patched** — `qb-thing/`, with our changes fenced by markers (below). Directory keeps its name,
   because renaming breaks every cross-package reference at once.
3. **Reworked** — `gns-thing/`. The rename happens in its own pull request that touches nothing else,
   so the diff is reviewable and a revert is clean.

Do not rename a package in the same PR as a behaviour change. One or the other.

### Marking edits inside a `qb-` package

Fence every change so the divergence from upstream stays greppable:

```lua
-- >>> GNS: rare catches scale with rod tier
local function RollCatch(rodTier)
    return CatchTable[math.random(#CatchTable)] * rodTier
end
-- <<< GNS
```

One-liners use a trailing marker:

```lua
Config.MaxWeight = 120000 -- GNS: raised from 24000
```

`grep -rn "GNS:"` must always answer "what have we changed so far". If your edit isn't fenced, it's
invisible to the next person deciding whether a package is ready to be reworked.

Files that are ours end-to-end inside a `qb-` package don't need fences — put a header comment at the
top saying the whole file is GENESIS code.

### Events

Event names start with the package that owns them, then the side, then the domain and action. This
already holds across most of the codebase:

```
gns-heists:server:vault:crack
gns-heists:client:vault:showTimer
```

Bare event names like `hospital:server:ambulanceAlert` are legacy. Don't add more. If you touch a
file containing one, renaming it is welcome as a separate commit.

Never register a new event under the `QBCore:` or `hl-` namespaces.

### Exports

The export key is the package directory name, always:

```lua
exports['gns-heists']:StartHeist(source, vaultId)
```

### Items, jobs, gangs

Custom items get a `gns_` prefix so they can never collide with something inherited:

```lua
['gns_thermite'] = { ... }
```

Jobs and gangs are player-facing strings and stay unprefixed — but add new ones to `qb-core/shared/`
in the same PR that uses them, never separately.

### Database

New tables are `gns_<name>`. Never add columns to an inherited table without saying so in the PR
description — inherited tables like `players`, `bank_accounts` and `inventories` are load-bearing and
shared across packages.

### Lua globals

Don't create new globals. Hang anything shared off a single namespace:

```lua
GNS = GNS or {}
GNS.Heists = {}
```

## Workflow

`main` is protected. Nobody commits to it directly — all changes land through pull requests.

1. Branch from `main`. Name it `type/package-short-description`, e.g. `feat/gns-heists-vault-timer`,
   `fix/qb-garages-impound-cost`.
2. Commit as you go. Keep commits scoped to one package where you can.
3. Open a pull request against `main`. Fill in the template.
4. Get an approval.
5. Squash and merge.

## Commit messages

Conventional Commits, with the package as the scope:

```
feat(gns-heists): add vault crack minigame
fix(qb-garages): correct impound fee rounding
refactor(qb-fishing): fence GNS edits ahead of rework
chore(gns-reputation): rename from qb-reputation
```

Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `chore`.

## Before you open a pull request

- [ ] `stylua .` is clean
- [ ] Package tested in a live Helix workspace, not just read through
- [ ] Every edit inside a `qb-` package is fenced with a `GNS:` marker
- [ ] New packages registered in the root `config.json`, after their dependencies
- [ ] Events, exports, items and tables follow the prefixes above
- [ ] No credentials, tokens, API keys, or webhook URLs — placeholders only
- [ ] No unrelated formatting churn

## Touching qb-core

`qb-core` loads first and everything depends on it. Changes to its shared exports or server events
break things far from your diff. Expect a slower review, and say in the PR description which packages
you checked against.

It is also the package we are least ready to rework. Patch it, fence it, leave the rename alone.

## Assets

Images and audio live in the owning package's `html/` directory. Compress before committing — several
inherited icons are over a megabyte and are not a model to follow.

## Licensing your contributions

GENESIS is GPL-3.0. By opening a pull request you agree your contribution is licensed under
GPL-3.0 as part of this project. You keep the copyright to what you wrote.

Only contribute code you have the right to contribute. Don't paste in code from another server,
another framework, or a paid script unless its license actually permits it and you say where it came
from in the PR description. GPL-3.0 does not launder incompatible code, and a takedown lands on the
whole project, not just your commit.

## Reporting bugs

Open an issue with the package name in the title, steps to reproduce, and what you expected. Include
your engine version if it differs from `5.7`.
