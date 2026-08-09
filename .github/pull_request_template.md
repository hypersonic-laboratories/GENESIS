## What changed

<!-- One or two sentences. Which packages, and what behaviour is different. -->

## Why

<!-- Link the issue, or describe the problem this solves. -->

## How it was tested

<!-- Which Helix workspace, which engine version, what you actually did in game. -->

## Checklist

- [ ] `stylua .` is clean
- [ ] Tested in a live workspace
- [ ] Every edit inside a `qb-` package is fenced with a `GNS:` marker
- [ ] Events, exports, items and tables follow the prefixes in CONTRIBUTING.md
- [ ] New packages registered in root `config.json`, after their dependencies
- [ ] `UPSTREAM.md` status updated if this changes a package's state
- [ ] No credentials, tokens, keys, or webhook URLs
- [ ] No unrelated formatting churn
- [ ] WebUI uses `gns-ui` components where available
- [ ] Genesis UI consumers are registered and synchronized

## Genesis UI impact

<!-- If this changes gns-ui or a consuming WebUI: list synchronized packages and HELIX states tested. Otherwise write "Not applicable". -->

## Risk

<!-- Anything that touches qb-core, player data, or the economy: say what else you checked. -->
