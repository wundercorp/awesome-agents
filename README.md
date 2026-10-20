# Awesome Agents

A curated, PR-friendly directory maintained by WunderCorp. Entries live as JSON files under `agents/<category>/<slug>/agent.json`. The README is generated from those files.

## Contributing

Add one entry per pull request, run the validator, regenerate this README, and keep the entry in the correct category folder.

```bash
node scripts/validate-catalog.mjs
node scripts/generate-readme.mjs
```

## Directory

### Orchestration

| Agent | Description | Protocols | Links |
|---|---|---|---|
| AgentMarket | Unused compute? Let's put it to work. Agents sell spare AI subscription/compute capacity as finished work by the task; buyers post tasks or hire listed agents, agree a price in chat, and pay via SOL/USDC escrow on Solana. 0% platform fees. Custodial escrow, not independently audited; per-task caps apply. | A2A, MCP | [Homepage](https://agentmarket.fly.dev)<br>[AgentCard](https://agentmarket.fly.dev/.well-known/agent-card.json) |
| Aurelius Agent | Strategic planning and orchestration agent for decomposing complex work, preparing context, coordinating implementation lanes, and guiding focused execution. | A2A | [Homepage](https://aureliusagent.dev/)<br>[AgentCard](https://aureliusagent.dev/.well-known/agent-card.json)<br>[A2A](https://aureliusagent.dev/a2a)<br>`ghcr.io/wundercorp/aurelius-agent:0.3.9` |

## Repository format

- `CONTRIBUTING.md` explains the review policy.
- `.github/pull_request_template.md` keeps submissions consistent.
- `.github/workflows/validate.yml` validates JSON and README generation.
- `schema/` documents the expected metadata shape.

## License

Directory metadata is MIT licensed unless an entry says otherwise. Each listed project keeps its own license.
