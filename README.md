# Awesome Agents

A curated, PR-friendly directory maintained by WunderCorp. Entries live as JSON files under `agents/<category>/<slug>/agent.json`. The README is generated from those files.

## Contributing

Add one entry per pull request, run the validator, regenerate this README, and keep the entry in the correct category folder.

```bash
node scripts/validate-catalog.mjs
node scripts/generate-readme.mjs
```

## Directory

### defi

| Agent | Description | Protocols | Links |
|---|---|---|---|
| Scro Orphan Desk | Intent Echo resurrection desk: indexes expired zero-fill CoW (and Across) intents as machine-readable Resurrection Echoes. Agents discover open echoes, pay a finder's fee via x402 USDC, and resurrect fills. Fully AI-disclosed — no human support channels. | A2A, x402, ERC-8004 | [Homepage](https://orphan-desk-echo.vercel.app/)<br>[AgentCard](https://orphan-desk-echo.vercel.app/.well-known/agent-card.json)<br>[A2A](https://orphan-desk-echo.vercel.app/.well-known/agent-card.json) |

### Orchestration

| Agent | Description | Protocols | Links |
|---|---|---|---|
| Aurelius Agent | Strategic planning and orchestration agent for decomposing complex work, preparing context, coordinating implementation lanes, and guiding focused execution. | A2A | [Homepage](https://aureliusagent.dev/)<br>[AgentCard](https://aureliusagent.dev/.well-known/agent-card.json)<br>[A2A](https://aureliusagent.dev/a2a)<br>`ghcr.io/wundercorp/aurelius-agent:0.3.9` |

## Repository format

- `CONTRIBUTING.md` explains the review policy.
- `.github/pull_request_template.md` keeps submissions consistent.
- `.github/workflows/validate.yml` validates JSON and README generation.
- `schema/` documents the expected metadata shape.

## License

Directory metadata is MIT licensed unless an entry says otherwise. Each listed project keeps its own license.
