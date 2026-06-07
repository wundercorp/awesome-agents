# Contributing

Thanks for improving this directory.

## Submission model

Add one agent per pull request.

Entries live at:

```text
agents/<category>/<slug>/agent.json
```

The folder category must match the `category` field. The folder slug must match the `slug` field.

## Required checks

```bash
node scripts/validate-catalog.mjs
node scripts/generate-readme.mjs
```

Commit the generated `README.md` if it changes.

## Review standards

Submissions should be public, useful, documented, reachable, and specific enough for users to evaluate before installing or connecting anything.

Do not submit malware, spyware, credential harvesters, exploit kits, fake projects, typosquats, abandoned placeholders, or entries that cannot be verified from public information.

## Categories

Use an existing category whenever possible. Add a new category only when none of the existing categories fit.

## Maintainer notes

Maintainers may edit descriptions for clarity, move entries between categories, reject duplicate submissions, or request proof that a service is operational.
