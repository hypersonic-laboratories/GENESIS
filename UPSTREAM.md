# Upstream inventory

GENESIS started from QBCore. We do not track upstream, do not merge upstream changes, and intend to
replace all of it. This file records how far along that is.

Update the Status column in the same pull request that changes a package. Statuses are defined in
[CONTRIBUTING.md](CONTRIBUTING.md#the-lifecycle-of-a-borrowed-package):

- **Vanilla** — inherited, no GENESIS edits
- **Patched** — inherited, carries `GNS:` fenced edits, keeps its `qb-` name
- **Diverged** — known to differ from upstream but edits are not yet fenced. Needs an audit.
- **Ours** — `gns-` prefixed, written or fully reworked by us

`grep -rn "GNS:" .` is the source of truth for what has actually been touched. If this table and that
grep disagree, the grep is right and this table is stale.

## Known gaps

### Dead `hl-` references in `qb-houses`

`hl-` packages came from the Helix Life project and are **not part of GENESIS**. Seven call sites in
`qb-houses` still reference them. None of these packages exist here, and no local package provides
equivalent exports — `qb-garages` only exports `getAllGarages`, not the deposit/withdraw functions
being called.

| Site | Reference | Kind | Effect when reached |
|---|---|---|---|
| `client.lua:332` | `hl-fishing:server:OpenFridge` | event | Silent no-op — fridge does nothing |
| `client.lua:345` | `hl-crafting:server:OpenTotem` | event | Silent no-op — totem does nothing |
| `client.lua:499` | `exports['hl-xray']:RegisterEntity` | export | Runtime error on furniture registration |
| `client.lua:939` | `exports['hl-fishing']:OpenKitchen` | export | Runtime error on stove use |
| `server.lua:636` | `exports['hl-garages']:DepositVehicle` | export | Runtime error on house garage deposit |
| `server.lua:783` | `exports['hl-onboarding']:CompleteStep` | export | Runtime error after placing furniture |
| `server.lua:953` | `exports['hl-garages']:WithdrawVehicle` | export | Runtime error on house garage withdraw |

The two event references fail quietly. The five export calls will throw. Each site needs a decision —
drop the feature, or reimplement it under a `gns-` package — so this is its own pull request, not a
blind delete. House garages and the fishing kitchen are missing features today, not just dead lines.

### Unregistered packages

`qb-diving` (567 lines) and `qb-mdt` (1,852 lines) have code but are absent from `config.json`, so
they never load. Intentionally left in place for now. CI warns rather than fails.

## Packages

45 directories, ~40,000 lines of Lua. 43 are registered in `config.json`; the load order column is
that position.

| Package | Load order | Status | Lua files | Lines |
|---|---|---|---|---|
| `qb-core` | 1 | Vanilla | 19 | 3,719 |
| `qb-interior` | 2 | Vanilla | 2 | 350 |
| `qb-multicharacter` | 3 | Vanilla | 4 | 393 |
| `qb-spawn` | 4 | Vanilla | 4 | 162 |
| `qb-target` | 5 | Vanilla | 3 | 948 |
| `qb-inventory` | 6 | Vanilla | 8 | 2,111 |
| `qb-zones` | 7 | Vanilla | 2 | 1,565 |
| `qb-radialmenu` | 8 | Vanilla | 4 | 1,284 |
| `qb-menu` | 9 | Vanilla | 1 | 78 |
| `qb-input` | 10 | Vanilla | 1 | 59 |
| `qb-minigames` | 11 | Vanilla | 1 | 358 |
| `qb-apartments` | 12 | Vanilla | 4 | 958 |
| `qb-houses` | 13 | **Diverged** | 4 | 2,324 |
| `qb-hud` | 14 | Vanilla | 3 | 290 |
| `qb-clothing` | 15 | Vanilla | 3 | 437 |
| `qb-banking` | 16 | Vanilla | 4 | 947 |
| `qb-cityhall` | 17 | Vanilla | 4 | 427 |
| `qb-shops` | 18 | Vanilla | 3 | 629 |
| `qb-management` | 19 | Vanilla | 4 | 860 |
| `qb-radio` | 20 | Vanilla | 4 | 223 |
| `qb-vehicleshop` | 21 | Vanilla | 4 | 373 |
| `qb-vehiclesales` | 22 | Vanilla | 4 | 939 |
| `qb-garages` | 23 | Vanilla | 4 | 866 |
| `qb-mechanicjob` | 24 | Vanilla | 3 | 355 |
| `qb-ambulancejob` | 25 | Vanilla | 4 | 897 |
| `qb-policejob` | 26 | Vanilla | 17 | 3,395 |
| `qb-garbagejob` | 27 | Vanilla | 4 | 483 |
| `qb-hotdogjob` | 28 | Vanilla | 4 | 1,308 |
| `qb-taxijob` | 29 | Vanilla | 4 | 646 |
| `qb-deliveryjob` | 30 | Vanilla | 5 | 726 |
| `qb-busjob` | 31 | Vanilla | 4 | 672 |
| `qb-pawnshop` | 32 | Vanilla | 4 | 768 |
| `qb-recyclejob` | 33 | Vanilla | 4 | 729 |
| `qb-fishing` | 34 | Vanilla | 3 | 245 |
| `qb-mining` | 35 | Vanilla | 3 | 342 |
| `qb-vineyard` | 36 | Vanilla | 4 | 529 |
| `qb-fuel` | 37 | Vanilla | 3 | 180 |
| `qb-admin` | 38 | Vanilla | 3 | 2,124 |
| `qb-phone` | 39 | Vanilla | 3 | 1,850 |
| `qb-crypto` | 40 | Vanilla | 4 | 656 |
| `qb-consumables` | 41 | Vanilla | 1 | 48 |
| `qb-crafting` | 42 | Vanilla | 4 | 534 |
| `qb-emotes` | 43 | Vanilla | 3 | 758 |
| `qb-diving` | not loaded | Vanilla | 4 | 567 |
| `qb-mdt` | not loaded | Vanilla | 9 | 1,852 |

Every row above is marked Vanilla because no `GNS:` fences exist yet — that is a starting baseline,
not a verified audit. `qb-houses` is the one package already known to differ.
