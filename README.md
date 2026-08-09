# GENESIS

Server scripts for GENESIS, a roleplay world built on the Helix engine by HELIX contributors.

This repository is the `scripts/` directory of a Helix workspace. The world and map are managed by
Helix itself and are not tracked here — only code.

## Workspace facts

| | |
|---|---|
| World | `genesis` |
| Engine version | `5.7` |
| Map | Pacifica |
| Experience definition | `DA_Experience_Roleplay` |
| Package ID | `7b59a0db-9ab2-49e0-a06e-3c51cb1a57cb` |
| World ID | `36de5209-b9bf-4198-aed6-f93c513a218a` |
| Source package | `f8e0cc8e-c5fc-4e1c-9b30-96f39131ed5a` |
| Dependencies | `f99646ca-7505-4fd2-a307-328d6cd1e9f2`, `92ca6269-5742-45e9-b858-ff57430b0797` |

## Getting set up

**Clone the GENESIS world in Helix.** That's it. The world is kept in sync with `main`, so a fresh
clone gives you the map, the dependencies, and every script already in place, ready to run.

You only need this repository if you intend to submit changes.

### If you want to contribute

Clone the world as above, then swap its `scripts/` directory for a git checkout so your work is
tracked:

```bash
rm -rf scripts && git clone <repo-url> scripts
```

The world's `scripts/` and this repository hold the same code, so nothing is lost — you're replacing
an untracked copy with a tracked one.

`content/map.json` and `metadata.json` sit one level above this repository and stay untracked. The
world owns them, and `metadata.json` carries a `workspaceId` unique to your machine.

### Experience definition

GENESIS runs the roleplay experience. `metadata.json` needs this block:

```json
"config": {
    "ExperienceDefinition": "DA_Experience_Roleplay"
}
```

**Publishing may strip it.** The one publish observed so far removed `config` from `metadata.json`
entirely, so after you publish a world, check whether the block survived and re-add it if not. If it
keeps disappearing, the value has to be set through Helix's own world settings rather than by editing
this file.

Worth checking first if the experience behaves wrongly after a publish.

## Layout

Each `qb-*` directory is one package. A package declares its load order in its own `package.json`:

```json
{
    "shared": ["shared/locale.lua", "config.lua"],
    "client": ["client/functions.lua"],
    "server": ["server/functions.lua"]
}
```

`config.json` at the repository root lists every package the server loads, in order. `qb-core` must
stay first — everything else depends on it.

## Adding a package

1. Create `qb-yourthing/` with `client/`, `server/`, `shared/` as needed.
2. Add a `package.json` declaring the files and their load order.
3. Register the package name in the root `config.json`, after its dependencies.

## Formatting

Lua is formatted with [StyLua](https://github.com/JohnnyMorganz/StyLua). Settings live in
`.stylua.toml` (4 spaces, single quotes, LF, 500 columns — wrapping is effectively off, which keeps
reflow out of diffs). Run it before opening a pull request:

```bash
stylua .
```

CI checks formatting on every pull request.

Formatting-only commits are listed in `.git-blame-ignore-revs` so they don't obscure who wrote a
line. GitHub applies it automatically; for local `git blame`, enable it once per clone:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

If you land a formatting-only commit, add its full SHA to that file in the same pull request.

## Assets and Git LFS

LFS is intentionally not enabled. The repository holds 547 PNGs in about 23 MB, and UI icons are
written once and rarely re-exported — so each is stored a single time and history stays small. LFS
pays for itself when binaries *churn*, not when there are merely many of them, and it costs every
contributor a `git lfs install` step plus GitHub LFS quota.

Revisit if assets start being re-exported regularly, or if `.git` grows past a few hundred megabytes.
`.gitattributes` has the rules ready to uncomment.

Compress before committing. Several inherited icons are over a megabyte — `qb-hotdogjob/html/icon.png`
is 2.1 MB — and are not a model to follow.

## Secrets

This repository is public. Anything committed here is world-readable the moment it lands, and stays
in history after it's deleted — assume a leaked key is compromised and rotate it rather than trying
to scrub it.

No live credentials, ever. Config values that take a key ship as placeholders — `qb-crypto/config.lua`
has `Api_key = 'put_api_key_here'`. Leave them that way and supply real values through your server's
local configuration, outside this repo. CI fails any pull request that looks like it contains a real
key or a Discord webhook URL.

## Relationship to QBCore Helix

QBCore Helix is HELIX-owned and is the starting point for GENESIS, not a dependency we track. We
intend to replace all of it. Package prefixes tell you where you are:

- `qb-` — inherited from QBCore Helix, temporary
- `hl-` — Helix Life project, dead code, remove on sight
- `gns-` — GENESIS, written or fully reworked by us

[UPSTREAM.md](UPSTREAM.md) tracks how far along that replacement is, package by package.

## License

GPL-3.0 — see [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — read the naming section before your first pull request.
